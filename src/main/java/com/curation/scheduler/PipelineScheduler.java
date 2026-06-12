package com.curation.scheduler;

import com.curation.config.PipelineProperties;
import com.curation.model.entity.Article;
import com.curation.monitoring.AlertService;
import com.curation.pipeline.stage1.ThemeCalibrationStage;
import com.curation.pipeline.stage7.CmsPublicationStage;
import com.curation.repository.ArticleRepository;
import com.curation.repository.ProcessedUrlRepository;
import com.curation.service.PipelineOrchestrator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class PipelineScheduler {

    private final PipelineOrchestrator orchestrator;
    private final ThemeCalibrationStage calibrationStage;
    private final ProcessedUrlRepository processedUrlRepository;
    private final AlertService alertService;
    private final PipelineProperties props;
    private final ArticleRepository articleRepository;
    private final CmsPublicationStage cmsPublicationStage;

    // Every minute — publish articles whose scheduledAt has passed
    @Scheduled(fixedDelay = 60_000)
    public void publishScheduledArticles() {
        List<Article> due = articleRepository.findByStatusAndScheduledAtBefore(
                Article.ArticleStatus.SCHEDULED, LocalDateTime.now());
        if (!due.isEmpty()) {
            log.info("Auto-publishing {} scheduled article(s)", due.size());
            cmsPublicationStage.publish(due);
        }
    }

    // Nightly at 02:00 IST (20:30 UTC previous day)
    @Scheduled(cron = "${pipeline.schedule-cron}", zone = "UTC")
    public void runNightlyPipeline() {
        log.info("Nightly pipeline triggered at {}", LocalDateTime.now());
        try {
            orchestrator.run();
        } catch (Exception e) {
            log.error("Nightly pipeline crashed: {}", e.getMessage(), e);
            alertService.sendThemeFailureAlert("ALL", e.getMessage());
        }
    }

    // Weekly calibration every Monday at 00:30 IST (19:00 UTC Sunday)
    @Scheduled(cron = "${pipeline.calibration-cron}", zone = "UTC")
    public void runWeeklyCalibration() {
        log.info("Weekly theme calibration triggered at {}", LocalDateTime.now());
        for (String themeId : props.getActiveThemeList()) {
            try {
                calibrationStage.calibrate(themeId);
                alertService.sendCalibrationCompleteAlert(themeId);
            } catch (Exception e) {
                log.error("Calibration failed for theme '{}': {}", themeId, e.getMessage());
            }
        }
    }

    // Daily cleanup of expired dedup records (older than 180 days)
    @Scheduled(cron = "0 0 3 * * *", zone = "UTC")
    public void cleanupExpiredUrls() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(props.getDedupTtlDays());
        processedUrlRepository.deleteExpiredBefore(cutoff);
        log.info("Cleaned up processed URLs older than {}", cutoff);
    }
}
