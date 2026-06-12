package com.curation.config;

import com.curation.model.entity.Article;
import com.curation.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class PublicArticleController {

    private final ArticleRepository articleRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPublished(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        List<Article> articles = articleRepository.findByStatusOrderByPublishedAtDesc(
                Article.ArticleStatus.PUBLISHED, pageable);
        long total = articleRepository.countByStatus(Article.ArticleStatus.PUBLISHED);
        return ResponseEntity.ok(Map.of("articles", articles, "total", total, "page", page, "size", size));
    }

    @GetMapping("/scheduled")
    public ResponseEntity<List<Article>> getScheduled() {
        return ResponseEntity.ok(articleRepository.findByStatusOrderByScheduledAtAsc(
                Article.ArticleStatus.SCHEDULED));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Article> getById(@PathVariable Long id) {
        return articleRepository.findById(id)
                .filter(a -> a.getStatus() == Article.ArticleStatus.PUBLISHED)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/articles/theme/{themeId}?page=0&size=20
    @GetMapping("/theme/{themeId}")
    public ResponseEntity<Map<String, Object>> getByTheme(
            @PathVariable String themeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        List<Article> articles = articleRepository.findByThemeIdAndStatusOrderByPublishedAtDesc(
                themeId, Article.ArticleStatus.PUBLISHED, pageable);
        long total = articleRepository.countByThemeIdAndStatus(themeId, Article.ArticleStatus.PUBLISHED);
        return ResponseEntity.ok(Map.of("articles", articles, "total", total, "page", page, "size", size));
    }

    // GET /api/articles/featured?page=0&size=10
    @GetMapping("/featured")
    public ResponseEntity<List<Article>> getFeatured(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        return ResponseEntity.ok(articleRepository.findByFeaturedTrueAndStatusOrderByPublishedAtDesc(
                Article.ArticleStatus.PUBLISHED, pageable));
    }
}
