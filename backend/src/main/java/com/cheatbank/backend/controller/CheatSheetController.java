package com.cheatbank.backend.controller;

import com.cheatbank.backend.dto.AuthDtos.MessageResponse;
import com.cheatbank.backend.dto.CheatSheetDtos.CheatSheetListResponse;
import com.cheatbank.backend.dto.CheatSheetDtos.CheatSheetRequest;
import com.cheatbank.backend.dto.CheatSheetDtos.SingleCheatSheetResponse;
import com.cheatbank.backend.model.User;
import com.cheatbank.backend.service.CheatSheetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cheat-sheets")
public class CheatSheetController {

    private final CheatSheetService cheatSheetService;

    public CheatSheetController(CheatSheetService cheatSheetService) {
        this.cheatSheetService = cheatSheetService;
    }

    @GetMapping
    public ResponseEntity<CheatSheetListResponse> getApprovedCheatSheets() {
        return ResponseEntity.ok(cheatSheetService.getApprovedCheatSheets());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CheatSheetListResponse> getPendingCheatSheets() {
        return ResponseEntity.ok(cheatSheetService.getPendingCheatSheets());
    }

    @PostMapping
    public ResponseEntity<SubmissionEnvelope> submitCheatSheet(
            @Valid @RequestBody CheatSheetRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new SubmissionEnvelope("Cheat sheet submitted for admin approval.", cheatSheetService.submit(request, user).cheatSheet()));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubmissionEnvelope> approveCheatSheet(
            @PathVariable Long id,
            @AuthenticationPrincipal User admin
    ) {
        return ResponseEntity.ok(
                new SubmissionEnvelope("Cheat sheet approved and published.", cheatSheetService.approve(id, admin).cheatSheet())
        );
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> rejectCheatSheet(@PathVariable Long id) {
        return ResponseEntity.ok(cheatSheetService.reject(id));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementView(@PathVariable Long id) {
        cheatSheetService.incrementView(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/download")
    public ResponseEntity<Void> incrementDownload(@PathVariable Long id) {
        cheatSheetService.incrementDownload(id);
        return ResponseEntity.noContent().build();
    }

    public record SubmissionEnvelope(String message, com.cheatbank.backend.dto.CheatSheetDtos.CheatSheetResponse cheatSheet) {}
}
