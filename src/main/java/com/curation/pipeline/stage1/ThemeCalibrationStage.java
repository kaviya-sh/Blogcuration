package com.curation.pipeline.stage1;

import com.curation.model.entity.Article;
import com.curation.model.entity.ThemeProfile;
import com.curation.repository.ArticleRepository;
import com.curation.repository.ThemeProfileRepository;
import com.curation.service.OllamaService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class ThemeCalibrationStage {

    private final ArticleRepository articleRepository;
    private final ThemeProfileRepository themeProfileRepository;
    private final OllamaService ollamaService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SYSTEM_PROMPT = """
            You are an editorial intelligence engine. Analyse the provided article summaries and return a JSON object with:
            - "dominantKeywords": comma-separated list of 10 key terms
            - "coveredSectors": comma-separated list of sectors covered
            - "editorialSpirit": exactly 50-word statement defining what makes an article worth publishing vs generic
            Return only valid JSON, no markdown.
            """;

    @Transactional
    public ThemeProfile calibrate(String themeId) {
        List<Article> recent = articleRepository
                .findTop50ByThemeIdAndStatusOrderByPublishedAtDesc(themeId, Article.ArticleStatus.PUBLISHED);

        String summaries = recent.stream()
                .map(a -> "- " + a.getEditorialSummary())
                .collect(Collectors.joining("\n"));

        String userMessage = "Theme: " + themeId + "\n\nRecent published summaries:\n" + summaries;
        String response = ollamaService.prompt(SYSTEM_PROMPT, userMessage);

        ThemeProfile profile = themeProfileRepository.findByThemeId(themeId)
                .orElseGet(ThemeProfile::new);
        profile.setThemeId(themeId);
        profile.setCalibratedAt(LocalDateTime.now());

        try {
            JsonNode json = objectMapper.readTree(response);
            profile.setDominantKeywords(json.path("dominantKeywords").asText());
            profile.setCoveredSectors(json.path("coveredSectors").asText());
            profile.setEditorialSpirit(json.path("editorialSpirit").asText());
        } catch (Exception e) {
            log.error("Failed to parse calibration response for theme {}: {}", themeId, e.getMessage());
            profile.setEditorialSpirit(response.substring(0, Math.min(500, response.length())));
        }

        ThemeProfile saved = themeProfileRepository.save(profile);
        log.info("Theme profile calibrated for '{}'", themeId);
        return saved;
    }
}
