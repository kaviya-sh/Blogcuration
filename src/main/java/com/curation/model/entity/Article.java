package com.curation.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2048)
    private String sourceUrl;

    @Column(nullable = false)
    private String themeId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String rawContent;

    private double relevanceScore;
    private double innovationScore;
    private boolean featured;

    @Column(columnDefinition = "TEXT")
    private String editorialSummary;

    private String language;
    private String imageUrl;
    private String cmsArticleId;

    @Enumerated(EnumType.STRING)
    private ArticleStatus status;

    private LocalDateTime discoveredAt;
    private LocalDateTime publishedAt;
    private LocalDateTime scheduledAt;

    public enum ArticleStatus {
        DISCOVERED, SCORED, REJECTED, SUMMARISED, IMAGE_ATTACHED, SCHEDULED, PUBLISHED, FAILED
    }
}
