package com.curation.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "cms")
public class CmsProperties {
    private String apiUrl;
    private String apiKey;
}
