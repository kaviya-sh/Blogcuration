package com.curation.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "processed_urls", indexes = @Index(columnList = "url"))
public class ProcessedUrl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 2048)
    private String url;

    @Column(nullable = false)
    private String themeId;

    @Column(nullable = false)
    private LocalDateTime processedAt;
}
