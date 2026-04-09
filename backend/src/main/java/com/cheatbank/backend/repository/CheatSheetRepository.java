package com.cheatbank.backend.repository;

import com.cheatbank.backend.model.CheatSheet;
import com.cheatbank.backend.model.CheatSheetStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheatSheetRepository extends JpaRepository<CheatSheet, Long> {
    List<CheatSheet> findByStatusOrderByCreatedAtDesc(CheatSheetStatus status);

    List<CheatSheet> findByStatusOrderByCreatedAtAsc(CheatSheetStatus status);
}
