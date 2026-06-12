package com.curation.service;

import com.curation.config.PipelineProperties;
import com.curation.model.entity.*;
import com.curation.monitoring.AlertService;
import com.curation.pipeline.stage0.ControlFlagStage;
import com.curation.pipeline.stage0.ControlFlagStage.ControlFlag;
import com.curation.pipeline.stage1.ThemeCalibrationStage;
import com.curation.pipeline.stage2.SearchQueryGenerationStage;
import com.curation.pipeline.stage3.ArticleDiscoveryStage;
import com.curation.pipeline.stage4.QualityScoringStage;
import com.curation.pipeline.stage5.SummaryGenerationStage;
import com.curation.pipeline.stage6.ImageRetrievalStage;
import com.curation.pipeline.stage7.CmsPublicationStage;
import com.curation.repository.ArticleRepository;
import com.curation.repository.PipelineRunRepository;
import com.curation.repository.ThemeProfileRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class PipelineOrchestrator {

    private final ControlFlagStage controlFlagStage;
    private final ThemeCalibrationStage calibrationStage;
    private final SearchQueryGenerationStage queryGenerationStage;
    private final ArticleDiscoveryStage discoveryStage;
    private final QualityScoringStage scoringStage;
    private final SummaryGenerationStage summaryStage;
    private final ImageRetrievalStage imageStage;
    private final CmsPublicationStage publicationStage;
    private final ThemeProfileRepository themeProfileRepository;
    private final PipelineRunRepository pipelineRunRepository;
    private final ArticleRepository articleRepository;
    private final AlertService alertService;
    private final PipelineProperties props;

    @PostConstruct
    public void recoverStaleRuns() {
        List<PipelineRun> stale = pipelineRunRepository.findByStatus(PipelineRun.RunStatus.RUNNING);
        if (!stale.isEmpty()) {
            log.warn("Recovering {} stale RUNNING pipeline run(s) on startup", stale.size());
            stale.forEach(r -> {
                r.setStatus(PipelineRun.RunStatus.FAILED);
                r.setErrorMessage("Marked FAILED on restart — JVM was killed mid-run");
                r.setCompletedAt(LocalDateTime.now());
                pipelineRunRepository.save(r);
            });
        }
    }

    public void run() {
        // Stage 0 — Control flag
        ControlFlag flag = controlFlagStage.readFlag();
        log.info("Pipeline control flag: {}", flag);

        if (flag == ControlFlag.PAUSE) {
            log.info("Pipeline PAUSED — exiting silently");
            return;
        }
        if (flag == ControlFlag.OFF) {
            log.warn("Pipeline is OFF — sending admin alert");
            alertService.sendPipelineOffAlert();
            return;
        }

        PipelineRun run = new PipelineRun();
        run.setStartedAt(LocalDateTime.now());
        run.setStatus(PipelineRun.RunStatus.RUNNING);
        pipelineRunRepository.save(run);

        AtomicInteger totalDiscovered = new AtomicInteger();
        AtomicInteger totalScored = new AtomicInteger();
        AtomicInteger totalRejected = new AtomicInteger();
        AtomicInteger totalPublished = new AtomicInteger();
        List<String> themeErrors = new java.util.concurrent.CopyOnWriteArrayList<>();

        List<String> themes = props.getActiveThemeList();
        ExecutorService executor = Executors.newFixedThreadPool(1);
        List<Future<?>> futures = new java.util.ArrayList<>();

        for (String themeId : themes) {
            futures.add(executor.submit(() -> {
                try {
                    log.info("Processing theme: {}", themeId);

                    // Stage 1 — Theme profile (use cached; calibration runs weekly separately)
                    ThemeProfile profile = themeProfileRepository.findByThemeId(themeId).orElse(null);

                    // Stage 2 — Query generation
                    List<String> queries = queryGenerationStage.generateQueries(themeId, profile);

                    // Stage 3 — Discovery & deduplication
                    List<Article> freshArticles = discoveryStage.discover(themeId, queries);

                    // Also pick up any previously DISCOVERED but unscored articles
                    List<Article> pending = articleRepository.findByThemeIdAndStatus(
                            themeId, Article.ArticleStatus.DISCOVERED);
                    List<Article> candidates = new java.util.ArrayList<>(freshArticles);
                    pending.stream().filter(p -> freshArticles.stream().noneMatch(f -> f.getId().equals(p.getId())))
                           .forEach(candidates::add);

                    totalDiscovered.addAndGet(freshArticles.size());

                    // Stage 4 — Quality scoring
                    List<Article> approved = scoringStage.score(candidates, profile);
                    totalScored.addAndGet(approved.size());
                    totalRejected.addAndGet(candidates.size() - approved.size());

                    // Stage 5 — Summary generation
                    List<Article> summarised = summaryStage.summarise(approved, profile);

                    // Stage 6 — Image retrieval
                    List<Article> withImages = imageStage.attachImages(summarised);

                    // Stage 7 — CMS publication
                    List<Article> published = publicationStage.publish(withImages);
                    totalPublished.addAndGet(published.size());

                    log.info("Theme '{}' complete — published {} articles", themeId, published.size());
                } catch (Exception e) {
                    log.error("Theme '{}' pipeline failed: {}", themeId, e.getMessage(), e);
                    alertService.sendThemeFailureAlert(themeId, e.getMessage());
                    themeErrors.add(themeId + ": " + e.getMessage());
                }
            }));
        }

        futures.forEach(f -> {
            try { f.get(90, TimeUnit.MINUTES); }
            catch (TimeoutException te) { log.error("Theme thread timed out after 90 minutes"); }
            catch (Exception e) { log.error("Theme thread error: {}", e.getMessage()); }
        });
        executor.shutdownNow();

        run.setCompletedAt(LocalDateTime.now());
        run.setTotalDiscovered(totalDiscovered.get());
        run.setTotalScored(totalScored.get());
        run.setTotalRejected(totalRejected.get());
        run.setTotalPublished(totalPublished.get());
        if (!themeErrors.isEmpty()) {
            run.setStatus(themeErrors.size() == themes.size()
                    ? PipelineRun.RunStatus.FAILED
                    : PipelineRun.RunStatus.COMPLETED);
            run.setErrorMessage(String.join(" | ", themeErrors));
        } else {
            run.setStatus(PipelineRun.RunStatus.COMPLETED);
        }
        pipelineRunRepository.save(run);

        log.info("Pipeline complete — discovered={} scored={} rejected={} published={}",
                totalDiscovered.get(), totalScored.get(), totalRejected.get(), totalPublished.get());
    }
}
