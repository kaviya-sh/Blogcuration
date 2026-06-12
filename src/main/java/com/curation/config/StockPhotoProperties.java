package com.curation.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "stock-photo")
public class StockPhotoProperties {
    private String apiUrl;
    private String apiKey;
}
