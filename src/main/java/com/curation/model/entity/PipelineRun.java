package com.curation.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pipeline_runs")
public class PipelineRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    private int totalDiscovered;
    private int totalScored;
    private int totalRejected;
    private int totalPublished;

    @Enumerated(EnumType.STRING)
    private RunStatus status;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    public enum RunStatus {
        RUNNING, COMPLETED, PAUSED, FAILED
    }
}
