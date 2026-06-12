package com.curation.pipeline.stage5;

import com.curation.config.PipelineProperties;
import com.curation.model.entity.Article;
import com.curation.model.entity.ThemeProfile;
import com.curation.repository.ArticleRepository;
import com.curation.service.OllamaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SummaryGenerationStage {

    private final OllamaService ollamaService;
    private final ArticleRepository articleRepository;
    private final PipelineProperties props;

    private static final String SYSTEM_PROMPT = """
            You are an expert editorial writer. Write a 100-word summary (strictly 90-110 words) in an expert,
            factual, slightly forward-looking voice.
            Structure: open with the key finding → highlight what is genuinely new → close with one concrete
            implication for innovation.
            Do NOT use marketing superlatives. Return only the summary text, no labels or markdown.
            """;

    @Transactional
    public List<Article> summarise(List<Article> articles, ThemeProfile profile) {
        List<Article> summarised = new ArrayList<>();

        for (Article article : articles) {
            String summary = generateWithRetry(article, profile);
            if (summary == null) {
                article.setStatus(Article.ArticleStatus.FAILED);
                articleRepository.save(article);
                log.warn("Skipping article {} — summary failed after retries", article.getId());
                continue;
            }
            article.setEditorialSummary(summary);
            article.setStatus(Article.ArticleStatus.SUMMARISED);
            summarised.add(articleRepository.save(article));
        }

        log.info("Summarised {}/{} articles", summarised.size(), articles.size());
        return summarised;
    }

    private String generateWithRetry(Article article, ThemeProfile profile) {
        String language = profile != null && "FR".equalsIgnoreCase(profile.getLanguage()) ? "French" : "English";
        String rawContent = article.getRawContent() != null ? article.getRawContent() : "";
        String userMessage = String.format(
                "Language: %s\nTheme: %s\nArticle title: %s\n\nContent excerpt:\n%s",
                language, article.getThemeId(), article.getTitle(), rawContent
        );

        for (int attempt = 0; attempt < props.getMaxSummaryRetries(); attempt++) {
            String summary = ollamaService.prompt(SYSTEM_PROMPT, userMessage);
            if (isValid(summary)) {
                article.setLanguage(language);
                return summary;
            }
            log.warn("Summary validation failed for article {} (attempt {})", article.getId(), attempt + 1);
        }
        return null;
    }

    private boolean isValid(String summary) {
        if (summary == null || summary.isBlank()) return false;
        // Accept any non-empty response from the model
        return summary.trim().split("\\s+").length >= 5;
    }
}
