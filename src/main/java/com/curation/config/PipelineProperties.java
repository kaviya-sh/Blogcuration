package com.curation.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "pipeline")
public class PipelineProperties {
    private String controlFlagKey;
    private int dedupTtlDays;
    private String scheduleCron;
    private String calibrationCron;
    private String themesActive;
    private int maxCandidatesPerTheme;
    private int minFreshArticlesPerTheme;
    private int summaryWordMin;
    private int summaryWordMax;
    private int relevanceThreshold;
    private int innovationThreshold;
    private int featuredRelevanceThreshold;
    private int featuredInnovationThreshold;
    private int imageWidth;
    private int imageHeight;
    private int articleFetchWords;
    private int maxSummaryRetries;
    private String bannedTerms;

    public List<String> getActiveThemeList() {
        return Arrays.asList(themesActive.split(","));
    }

    public List<String> getBannedTermList() {
        return Arrays.asList(bannedTerms.split(","));
    }
}
