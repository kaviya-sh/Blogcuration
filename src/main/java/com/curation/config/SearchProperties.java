package com.curation.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "search")
public class SearchProperties {
    private String apiUrl;
    private String apiKey;
    private int resultsPerQuery;
}
