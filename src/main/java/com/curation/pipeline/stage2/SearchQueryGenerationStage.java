package com.curation.pipeline.stage2;

import com.curation.model.entity.ThemeProfile;
import com.curation.service.OllamaService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SearchQueryGenerationStage {

    private final OllamaService ollamaService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SYSTEM_PROMPT = """
            You are a research query specialist. Generate exactly 5 targeted search queries for the given theme.
            Queries must cover: innovation press, academic preprints, startup funding, patent filings, industry press releases.
            Include both English and French queries where appropriate.
            Add a novelty seed (today's date context) to avoid repeating previous weeks.
            Return a JSON array of strings: ["query1", "query2", ...]. No markdown.
            """;

    public List<String> generateQueries(String themeId, ThemeProfile profile) {
        String userMessage = String.format(
                "Theme: %s\nEditorial spirit: %s\nDominant keywords: %s\nDate context: %s\n\nGenerate 5 search queries.",
                themeId,
                profile != null ? profile.getEditorialSpirit() : "innovation and emerging technology",
                profile != null ? profile.getDominantKeywords() : "",
                LocalDate.now()
        );

        String response = ollamaService.prompt(SYSTEM_PROMPT, userMessage);
        List<String> queries = new ArrayList<>();

        try {
            // Try to find a JSON array in the response
            String trimmed = response.trim();
            int start = trimmed.indexOf('[');
            int end = trimmed.lastIndexOf(']');
            if (start >= 0 && end > start) {
                trimmed = trimmed.substring(start, end + 1);
            }
            JsonNode array = objectMapper.readTree(trimmed);
            if (array.isArray()) {
                array.forEach(node -> queries.add(node.asText()));
            }
        } catch (Exception e) {
            log.warn("Failed to parse queries for theme {}, using fallback queries", themeId);
        }
        // Fallback: always ensure at least 3 queries
        if (queries.isEmpty()) {
            queries.add(themeId + " innovation " + LocalDate.now().getYear());
            queries.add(themeId + " latest research " + LocalDate.now().getYear());
            queries.add(themeId + " startup funding " + LocalDate.now().getYear());
        }

        log.info("Generated {} queries for theme '{}'", queries.size(), themeId);
        return queries;
    }
}
