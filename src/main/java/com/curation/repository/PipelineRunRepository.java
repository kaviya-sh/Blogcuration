package com.curation.repository;

import com.curation.model.entity.PipelineRun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PipelineRunRepository extends JpaRepository<PipelineRun, Long> {
    Optional<PipelineRun> findTopByOrderByStartedAtDesc();
    List<PipelineRun> findByStatus(PipelineRun.RunStatus status);
}
