package com.curation.pipeline.stage6;

import com.curation.config.PipelineProperties;
import com.curation.config.StockPhotoProperties;
import com.curation.model.entity.Article;
import com.curation.repository.ArticleRepository;
import com.curation.service.OllamaService;
import com.curation.service.LocalImageStorageService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ImageRetrievalStage {

    private final StockPhotoProperties stockPhotoProps;
    private final PipelineProperties pipelineProps;
    private final ArticleRepository articleRepository;
    private final OllamaService ollamaService;
    private final LocalImageStorageService localImageStorageService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Map<String, String> THEME_FALLBACK_IMAGES = Map.of(
            "tech-innovation", "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630",
            "startup-funding", "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&h=630",
            "ai-research", "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630",
            "sustainability", "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=630"
    );

    private static final String DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630";

    private static final String IMAGE_KEYWORD_PROMPT = "Generate 3 concise visual search keywords for a stock photo representing this article. Return only a comma-separated list.";

    @Transactional
    public List<Article> attachImages(List<Article> articles) {
        for (Article article : articles) {
            String imageUrl = resolveImage(article);
            String archivedUrl = localImageStorageService.archiveImage(imageUrl, article.getThemeId());
            article.setImageUrl(archivedUrl);
            article.setStatus(Article.ArticleStatus.IMAGE_ATTACHED);
            articleRepository.save(article);
        }
        log.info("Images attached to {} articles", articles.size());
        return articles;
    }

    private String resolveImage(Article article) {
        // Tier 1: OG image from article page
        String ogImage = extractOgImage(article.getSourceUrl());
        if (ogImage != null) return ogImage;

        // Tier 2: Stock photo API
        String stockImage = fetchStockPhoto(article);
        if (stockImage != null) return stockImage;

        // Tier 3: Pre-approved theme fallback
        return THEME_FALLBACK_IMAGES.getOrDefault(article.getThemeId(), DEFAULT_FALLBACK);
    }

    private String extractOgImage(String url) {
        try {
            Document doc = Jsoup.connect(url).userAgent("Mozilla/5.0").timeout(8000).get();
            String ogUrl = doc.select("meta[property=og:image]").attr("content");
            if (!ogUrl.isBlank() && ogUrl.startsWith("http")) {
                log.debug("OG image found for {}", url);
                return ogUrl + "?w=" + pipelineProps.getImageWidth() + "&h=" + pipelineProps.getImageHeight();
            }
        } catch (Exception e) {
            log.debug("OG image extraction failed for {}: {}", url, e.getMessage());
        }
        return null;
    }

    private String fetchStockPhoto(Article article) {
        try {
            String title = article.getTitle() != null ? article.getTitle() : article.getThemeId();
            String keywords = ollamaService.prompt(IMAGE_KEYWORD_PROMPT,
                    "Article title: " + title + "\nTheme: " + article.getThemeId());
            if (keywords == null || keywords.isBlank()) return null;

            String searchUrl = UriComponentsBuilder.fromHttpUrl(stockPhotoProps.getApiUrl())
                    .queryParam("query", keywords.trim())
                    .queryParam("per_page", 1)
                    .queryParam("client_id", stockPhotoProps.getApiKey())
                    .toUriString();

            ResponseEntity<String> response = restTemplate.getForEntity(searchUrl, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode results = root.path("results");

            if (results.isArray() && results.size() > 0) {
                return results.get(0).path("urls").path("regular").asText();
            }
        } catch (Exception e) {
            log.warn("Stock photo fetch failed for article {}: {}", article.getId(), e.getMessage());
        }
        return null;
    }
}
