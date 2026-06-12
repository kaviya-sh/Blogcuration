package com.curation.pipeline.stage4;

import com.curation.config.PipelineProperties;
import com.curation.model.entity.Article;
import com.curation.model.entity.ThemeProfile;
import com.curation.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class QualityScoringStage {

    private final ArticleRepository articleRepository;
    private final PipelineProperties props;

    // Theme keyword maps for relevance scoring
    private static final Map<String, List<String>> THEME_KEYWORDS = Map.of(
        "tech-innovation",  List.of("technology","innovation","ai","software","hardware","startup","research","engineering","digital","computing","robot","automation","chip","semiconductor","quantum"),
        "startup-funding",  List.of("startup","funding","venture","capital","investment","series","raise","million","billion","founder","vc","seed","valuation","unicorn","acquisition"),
        "ai-research",      List.of("ai","artificial intelligence","machine learning","deep learning","llm","model","neural","gpt","transformer","dataset","benchmark","training","inference","nlp","computer vision"),
        "sustainability",   List.of("sustainability","climate","renewable","energy","carbon","green","solar","wind","electric","hydrogen","emission","environment","net zero","clean","eco")
    );

    // Innovation signal words
    private static final List<String> INNOVATION_SIGNALS = List.of(
        "new","novel","first","breakthrough","launch","release","announce","discover","develop","introduce",
        "pioneer","advance","improve","record","achieve","unveil","patent","research","study","publish"
    );

    @Transactional
    public List<Article> score(List<Article> candidates, ThemeProfile profile) {
        List<Article> approved = new ArrayList<>();

        for (Article article : candidates) {
            try {
                String excerpt = fetchExcerpt(article.getSourceUrl());
                if (excerpt.isBlank()) {
                    reject(article);
                    continue;
                }
                article.setRawContent(excerpt);

                double relevance  = scoreRelevance(article.getThemeId(), article.getTitle(), excerpt, profile);
                double innovation = scoreInnovation(article.getTitle(), excerpt);

                article.setRelevanceScore(relevance);
                article.setInnovationScore(innovation);

                if (relevance >= props.getRelevanceThreshold() && innovation >= props.getInnovationThreshold()) {
                    article.setFeatured(relevance >= props.getFeaturedRelevanceThreshold()
                            && innovation >= props.getFeaturedInnovationThreshold());
                    article.setStatus(Article.ArticleStatus.SCORED);
                    approved.add(articleRepository.save(article));
                    log.info("Approved '{}' R={} I={} featured={}", article.getTitle(), relevance, innovation, article.isFeatured());
                } else {
                    reject(article);
                }
            } catch (Exception e) {
                log.error("Scoring failed for {}: {}", article.getSourceUrl(), e.getMessage());
                reject(article);
            }
        }

        log.info("Scoring complete: {}/{} approved", approved.size(), candidates.size());
        return approved;
    }

    private double scoreRelevance(String themeId, String title, String excerpt, ThemeProfile profile) {
        String text = (title + " " + excerpt).toLowerCase();
        List<String> keywords = THEME_KEYWORDS.getOrDefault(themeId, List.of());

        // Add profile keywords if available
        List<String> allKeywords = new ArrayList<>(keywords);
        if (profile != null && profile.getDominantKeywords() != null) {
            Arrays.stream(profile.getDominantKeywords().split(","))
                  .map(String::trim).map(String::toLowerCase)
                  .forEach(allKeywords::add);
        }

        long matches = allKeywords.stream().filter(text::contains).count();
        double ratio = allKeywords.isEmpty() ? 0.5 : (double) matches / allKeywords.size();

        // Scale to 0-10, minimum 5.0 if any keywords match
        double score = Math.min(10.0, ratio * 20.0);
        if (matches > 0 && score < 5.0) score = 5.0;
        return Math.round(score * 10.0) / 10.0;
    }

    private double scoreInnovation(String title, String excerpt) {
        String text = (title + " " + excerpt).toLowerCase();
        long signals = INNOVATION_SIGNALS.stream().filter(text::contains).count();

        // Scale: 2+ signals = 6+, 5+ signals = 8+
        double score = Math.min(10.0, 4.0 + (signals * 1.2));
        return Math.round(score * 10.0) / 10.0;
    }

    private String fetchExcerpt(String url) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0")
                    .timeout(10_000)
                    .get();
            String text = doc.body().text();
            String[] words = text.split("\\s+");
            return String.join(" ", Arrays.copyOfRange(words, 0, Math.min(props.getArticleFetchWords(), words.length)));
        } catch (Exception e) {
            log.warn("Could not fetch article content from {}: {}", url, e.getMessage());
            return "";
        }
    }

    private void reject(Article article) {
        article.setStatus(Article.ArticleStatus.REJECTED);
        articleRepository.save(article);
    }
}
