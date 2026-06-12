package com.curation.pipeline.stage7;

import com.curation.config.CmsProperties;
import com.curation.model.entity.Article;
import com.curation.repository.ArticleRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CmsPublicationStage {

    private final CmsProperties cmsProps;
    private final ArticleRepository articleRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Strapi v4 REST API — POST /api/articles
    // Payload must be wrapped inside a "data" object
    // Response returns article id inside data.id

    @Transactional
    public List<Article> publish(List<Article> articles) {
        List<Article> published = new ArrayList<>();

        for (Article article : articles) {
            try {
                // Strapi v4 requires all fields nested under "data"
                ObjectNode data = objectMapper.createObjectNode();
                data.put("title",          article.getTitle());
                data.put("summary",        article.getEditorialSummary());
                data.put("sourceUrl",      article.getSourceUrl());
                data.put("imageUrl",       article.getImageUrl());
                data.put("themeId",        article.getThemeId());
                data.put("featured",       article.isFeatured());
                data.put("language",       article.getLanguage() != null ? article.getLanguage() : "English");
                data.put("relevanceScore", article.getRelevanceScore());
                data.put("innovationScore",article.getInnovationScore());

                ObjectNode payload = objectMapper.createObjectNode();
                payload.set("data", data);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", "Bearer " + cmsProps.getApiKey());

                HttpEntity<String> request = new HttpEntity<>(payload.toString(), headers);

                ResponseEntity<String> response = restTemplate.exchange(
                        cmsProps.getApiUrl() + "/api/articles",
                        HttpMethod.POST, request, String.class);

                if (response.getStatusCode().is2xxSuccessful()) {
                    JsonNode responseBody = objectMapper.readTree(response.getBody());
                    // Strapi v4 returns { "data": { "id": 1, "attributes": {...} } }
                    String cmsId = responseBody.path("data").path("id").asText("");
                    article.setCmsArticleId(cmsId.isBlank() ? null : cmsId);
                    article.setStatus(Article.ArticleStatus.PUBLISHED);
                    article.setPublishedAt(LocalDateTime.now());
                    published.add(articleRepository.save(article));
                    log.info("Published '{}' to Strapi with id={}", article.getTitle(), cmsId);
                } else {
                    markFailed(article, "Strapi returned " + response.getStatusCode());
                }
            } catch (Exception e) {
                log.error("Strapi publish failed for article {}: {}", article.getId(), e.getMessage());
                markFailed(article, e.getMessage());
            }
        }

        log.info("Published {}/{} articles to Strapi", published.size(), articles.size());
        return published;
    }

    private void markFailed(Article article, String reason) {
        article.setStatus(Article.ArticleStatus.FAILED);
        articleRepository.save(article);
        log.error("Article {} failed: {}", article.getId(), reason);
    }
}
