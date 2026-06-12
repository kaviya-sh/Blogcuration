package com.curation.pipeline.stage3;

import com.curation.config.PipelineProperties;
import com.curation.config.SearchProperties;
import com.curation.model.entity.Article;
import com.curation.model.entity.ProcessedUrl;
import com.curation.repository.ArticleRepository;
import com.curation.repository.ProcessedUrlRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ArticleDiscoveryStage {

    private final SearchProperties searchProps;
    private final PipelineProperties pipelineProps;
    private final ProcessedUrlRepository processedUrlRepository;
    private final ArticleRepository articleRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public List<Article> discover(String themeId, List<String> queries) {
        List<Article> freshArticles = new ArrayList<>();

        for (String query : queries) {
            if (freshArticles.size() >= pipelineProps.getMaxCandidatesPerTheme()) break;

            String url = UriComponentsBuilder.fromHttpUrl(searchProps.getApiUrl())
                    .queryParam("q", query)
                    .queryParam("api_key", searchProps.getApiKey())
                    .queryParam("num", searchProps.getResultsPerQuery())
                    .toUriString();

            try {
                ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode results = root.path("organic_results");

                for (JsonNode result : results) {
                    String articleUrl = result.path("link").asText();
                    String title = result.path("title").asText();

                    if (articleUrl == null || articleUrl.isBlank() || !articleUrl.startsWith("http")
                            || processedUrlRepository.existsByUrl(articleUrl)) continue;

                    Article article = new Article();
                    article.setSourceUrl(articleUrl);
                    article.setTitle(title);
                    article.setThemeId(themeId);
                    article.setStatus(Article.ArticleStatus.DISCOVERED);
                    article.setDiscoveredAt(LocalDateTime.now());
                    freshArticles.add(articleRepository.save(article));

                    ProcessedUrl processed = new ProcessedUrl();
                    processed.setUrl(articleUrl);
                    processed.setThemeId(themeId);
                    processed.setProcessedAt(LocalDateTime.now());
                    processedUrlRepository.save(processed);
                }
            } catch (Exception e) {
                log.error("Search failed for query '{}': {}", query, e.getMessage());
            }
        }

        log.info("Discovered {} fresh articles for theme '{}'", freshArticles.size(), themeId);
        return freshArticles;
    }
}
