package com.curation.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
public class LocalImageStorageService {

    private final String uploadDir;
    private final String baseUrl;
    private final HttpClient httpClient;

    public LocalImageStorageService(
            @Value("${image.upload-dir:uploads/images}") String uploadDir,
            @Value("${image.base-url:http://localhost:8080/images}") String baseUrl) {
        this.uploadDir = uploadDir;
        this.baseUrl = baseUrl;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .followRedirects(java.net.http.HttpClient.Redirect.NORMAL)
                .build();
    }

    public String archiveImage(String imageUrl, String themeId) {
        if (imageUrl == null || imageUrl.isBlank()) return imageUrl;
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(imageUrl))
                    .timeout(Duration.ofSeconds(15))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() != 200 || response.body().length == 0) {
                log.warn("Failed to download image from {}: status={}", imageUrl, response.statusCode());
                return imageUrl;
            }

            String contentType = response.headers().firstValue("content-type").orElse("image/jpeg");
            String ext = contentType.contains("png") ? ".png" : ".jpg";
            String filename = UUID.randomUUID() + ext;

            Path themeDir = Paths.get(uploadDir, themeId);
            Files.createDirectories(themeDir);

            Path filePath = themeDir.resolve(filename);
            Files.write(filePath, response.body());

            String localUrl = baseUrl + "/" + themeId + "/" + filename;
            log.debug("Image saved locally: {}", localUrl);
            return localUrl;

        } catch (Exception e) {
            log.warn("Local image save failed for {}: {} — using original URL", imageUrl, e.getMessage());
            return imageUrl;
        }
    }
}
