package com.curation.repository;

import com.curation.model.entity.ProcessedUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

public interface ProcessedUrlRepository extends JpaRepository<ProcessedUrl, Long> {
    boolean existsByUrl(String url);

    @Modifying
    @Transactional
    @Query("DELETE FROM ProcessedUrl p WHERE p.processedAt < :cutoff")
    void deleteExpiredBefore(LocalDateTime cutoff);
}
