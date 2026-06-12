package com.curation.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "theme_profiles")
public class ThemeProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String themeId;

    @Column(columnDefinition = "TEXT")
    private String dominantKeywords;

    @Column(columnDefinition = "TEXT")
    private String coveredSectors;

    @Column(length = 500)
    private String editorialSpirit;

    private String language; // EN or FR

    private LocalDateTime calibratedAt;
}
