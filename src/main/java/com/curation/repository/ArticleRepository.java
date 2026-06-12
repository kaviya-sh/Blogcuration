package com.curation.repository;

import com.curation.model.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByStatusAndScheduledAtBefore(Article.ArticleStatus status, LocalDateTime now);
    List<Article> findByStatusOrderByScheduledAtAsc(Article.ArticleStatus status);
    List<Article> findByThemeIdOrderByPublishedAtDesc(String themeId, Pageable pageable);
    List<Article> findTop50ByThemeIdAndStatusOrderByPublishedAtDesc(String themeId, Article.ArticleStatus status);
    List<Article> findByThemeIdAndStatus(String themeId, Article.ArticleStatus status);
    List<Article> findByStatusOrderByPublishedAtDesc(Article.ArticleStatus status, Pageable pageable);
    List<Article> findByThemeIdAndStatusOrderByPublishedAtDesc(String themeId, Article.ArticleStatus status, Pageable pageable);
    List<Article> findByFeaturedTrueAndStatusOrderByPublishedAtDesc(Article.ArticleStatus status, Pageable pageable);
    long countByStatus(Article.ArticleStatus status);
    long countByThemeIdAndStatus(String themeId, Article.ArticleStatus status);
}
