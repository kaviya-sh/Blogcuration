package com.curation.config;

import com.curation.model.entity.Article;
import com.curation.model.entity.PipelineRun;
import com.curation.pipeline.stage0.ControlFlagStage;
import com.curation.pipeline.stage0.ControlFlagStage.ControlFlag;
import com.curation.pipeline.stage1.ThemeCalibrationStage;
import com.curation.repository.ArticleRepository;
import com.curation.repository.PipelineRunRepository;
import com.curation.service.PipelineOrchestrator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/pipeline")
@RequiredArgsConstructor
public class PipelineController {

    private final ControlFlagStage controlFlagStage;
    private final PipelineOrchestrator orchestrator;
    private final ThemeCalibrationStage calibrationStage;
    private final PipelineRunRepository pipelineRunRepository;
    private final ArticleRepository articleRepository;
    private final PipelineProperties props;

    @GetMapping("/flag")
    public ResponseEntity<Map<String, String>> getFlag() {
        return ResponseEntity.ok(Map.of("flag", controlFlagStage.readFlag().name()));
    }

    @PutMapping("/flag/{flag}")
    public ResponseEntity<Map<String, String>> setFlag(@PathVariable String flag) {
        try {
            ControlFlag cf = ControlFlag.valueOf(flag.toUpperCase());
            controlFlagStage.setFlag(cf);
            return ResponseEntity.ok(Map.of("flag", cf.name(), "status", "updated"));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid flag value. Use ON, PAUSE, or OFF.");
        }
    }

    @PostMapping("/trigger")
    public ResponseEntity<Map<String, String>> triggerManually() {
        CompletableFuture.runAsync(orchestrator::run);
        return ResponseEntity.accepted().body(Map.of("status", "Pipeline triggered asynchronously"));
    }

    @PostMapping("/calibrate/{themeId}")
    public ResponseEntity<Map<String, String>> calibrateTheme(@PathVariable String themeId) {
        calibrationStage.calibrate(themeId);
        return ResponseEntity.ok(Map.of("theme", themeId, "status", "calibrated"));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        PipelineRun last = pipelineRunRepository.findTopByOrderByStartedAtDesc().orElse(null);
        long published = articleRepository.countByStatus(Article.ArticleStatus.PUBLISHED);
        long failed = articleRepository.countByStatus(Article.ArticleStatus.FAILED);
        return ResponseEntity.ok(Map.of(
                "lastRun", last != null ? last : "No runs yet",
                "totalPublished", published,
                "totalFailed", failed,
                "controlFlag", controlFlagStage.readFlag().name()
        ));
    }

    @GetMapping("/runs")
    public ResponseEntity<List<PipelineRun>> getAllRuns() {
        return ResponseEntity.ok(pipelineRunRepository.findAll(
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "startedAt")));
    }

    @GetMapping("/articles/{themeId}")
    public ResponseEntity<List<Article>> getArticlesByTheme(
            @PathVariable String themeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        return ResponseEntity.ok(articleRepository.findByThemeIdOrderByPublishedAtDesc(themeId, pageable));
    }

    @GetMapping("/themes")
    public ResponseEntity<List<String>> getActiveThemes() {
        return ResponseEntity.ok(props.getActiveThemeList());
    }

    @PutMapping("/articles/{id}/schedule")
    public ResponseEntity<Map<String, Object>> scheduleArticle(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return articleRepository.findById(id).map(article -> {
            LocalDateTime scheduleTime = LocalDateTime.parse(body.get("scheduledAt"));
            article.setScheduledAt(scheduleTime);
            article.setStatus(Article.ArticleStatus.SCHEDULED);
            articleRepository.save(article);
            return ResponseEntity.ok(Map.<String, Object>of(
                "id", id, "scheduledAt", scheduleTime.toString(), "status", "SCHEDULED"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
