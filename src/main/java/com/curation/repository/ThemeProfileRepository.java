package com.curation.repository;

import com.curation.model.entity.ThemeProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ThemeProfileRepository extends JpaRepository<ThemeProfile, Long> {
    Optional<ThemeProfile> findByThemeId(String themeId);
}
