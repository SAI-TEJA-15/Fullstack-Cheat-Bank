package com.cheatbank.backend.service;

import com.cheatbank.backend.dto.CheatSheetDtos.AuthorDto;
import com.cheatbank.backend.dto.CheatSheetDtos.CheatSheetListResponse;
import com.cheatbank.backend.dto.CheatSheetDtos.CheatSheetRequest;
import com.cheatbank.backend.dto.CheatSheetDtos.CheatSheetResponse;
import com.cheatbank.backend.dto.CheatSheetDtos.CommandDto;
import com.cheatbank.backend.dto.CheatSheetDtos.SectionDto;
import com.cheatbank.backend.dto.CheatSheetDtos.SingleCheatSheetResponse;
import com.cheatbank.backend.dto.CheatSheetDtos.StatsDto;
import com.cheatbank.backend.dto.AuthDtos.MessageResponse;
import com.cheatbank.backend.model.CheatSheet;
import com.cheatbank.backend.model.CheatSheetStatus;
import com.cheatbank.backend.model.User;
import com.cheatbank.backend.repository.CheatSheetRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CheatSheetService {

    private static final List<String> ALLOWED_CATEGORIES = List.of(
            "Development", "Programming", "Design", "System Admin", "Database", "DevOps", "Tools"
    );

    private final CheatSheetRepository cheatSheetRepository;
    private final ObjectMapper objectMapper;

    public CheatSheetService(CheatSheetRepository cheatSheetRepository, ObjectMapper objectMapper) {
        this.cheatSheetRepository = cheatSheetRepository;
        this.objectMapper = objectMapper;
    }

    public CheatSheetListResponse getApprovedCheatSheets() {
        return new CheatSheetListResponse(
                cheatSheetRepository.findByStatusOrderByCreatedAtDesc(CheatSheetStatus.APPROVED)
                        .stream()
                        .map(this::mapResponse)
                        .toList()
        );
    }

    public CheatSheetListResponse getPendingCheatSheets() {
        return new CheatSheetListResponse(
                cheatSheetRepository.findByStatusOrderByCreatedAtAsc(CheatSheetStatus.PENDING)
                        .stream()
                        .map(this::mapResponse)
                        .toList()
        );
    }

    public SingleCheatSheetResponse submit(CheatSheetRequest request, User user) {
        validateRequest(request);

        CheatSheet cheatSheet = new CheatSheet();
        cheatSheet.setTitle(request.title().trim());
        cheatSheet.setDescription(request.description().trim());
        cheatSheet.setCategory(request.category().trim());
        cheatSheet.setAuthorName(request.authorName().trim());
        cheatSheet.setTags(writeJson(request.tags().stream().map(String::trim).filter(tag -> !tag.isBlank()).toList()));
        cheatSheet.setContent(writeJson(request.content()));
        cheatSheet.setSubmittedBy(user);
        cheatSheet.setStatus(CheatSheetStatus.PENDING);
        cheatSheet.setViews(0);
        cheatSheet.setDownloads(0);
        cheatSheet.setUpdatedAt(LocalDateTime.now());

        return new SingleCheatSheetResponse(mapResponse(cheatSheetRepository.save(cheatSheet)));
    }

    public SingleCheatSheetResponse approve(Long id, User admin) {
        CheatSheet cheatSheet = findById(id);

        if (cheatSheet.getStatus() != CheatSheetStatus.PENDING) {
            throw new IllegalArgumentException("Pending cheat sheet not found.");
        }

        cheatSheet.setStatus(CheatSheetStatus.APPROVED);
        cheatSheet.setApprovedBy(admin);
        cheatSheet.setApprovedAt(LocalDateTime.now());
        cheatSheet.setUpdatedAt(LocalDateTime.now());

        return new SingleCheatSheetResponse(mapResponse(cheatSheetRepository.save(cheatSheet)));
    }

    public MessageResponse reject(Long id) {
        CheatSheet cheatSheet = findById(id);

        if (cheatSheet.getStatus() != CheatSheetStatus.PENDING) {
            throw new IllegalArgumentException("Pending cheat sheet not found.");
        }

        cheatSheet.setStatus(CheatSheetStatus.REJECTED);
        cheatSheet.setUpdatedAt(LocalDateTime.now());
        cheatSheetRepository.save(cheatSheet);

        return new MessageResponse("Cheat sheet rejected.");
    }

    public void incrementView(Long id) {
        CheatSheet cheatSheet = findById(id);
        if (cheatSheet.getStatus() == CheatSheetStatus.APPROVED) {
            cheatSheet.setViews(cheatSheet.getViews() + 1);
            cheatSheet.setUpdatedAt(LocalDateTime.now());
            cheatSheetRepository.save(cheatSheet);
        }
    }

    public void incrementDownload(Long id) {
        CheatSheet cheatSheet = findById(id);
        if (cheatSheet.getStatus() == CheatSheetStatus.APPROVED) {
            cheatSheet.setDownloads(cheatSheet.getDownloads() + 1);
            cheatSheet.setUpdatedAt(LocalDateTime.now());
            cheatSheetRepository.save(cheatSheet);
        }
    }

    private CheatSheet findById(Long id) {
        return cheatSheetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cheat sheet not found."));
    }

    private void validateRequest(CheatSheetRequest request) {
        if (!ALLOWED_CATEGORIES.contains(request.category().trim())) {
            throw new IllegalArgumentException("Invalid category selected.");
        }

        boolean hasValidTags = request.tags().stream().map(String::trim).anyMatch(tag -> !tag.isBlank());
        if (!hasValidTags) {
            throw new IllegalArgumentException("At least one tag is required.");
        }
    }

    private CheatSheetResponse mapResponse(CheatSheet cheatSheet) {
        return new CheatSheetResponse(
                cheatSheet.getId(),
                cheatSheet.getTitle(),
                cheatSheet.getDescription(),
                cheatSheet.getCategory(),
                readTags(cheatSheet.getTags()),
                new AuthorDto(cheatSheet.getAuthorName()),
                new StatsDto(cheatSheet.getViews(), cheatSheet.getDownloads()),
                cheatSheet.getCreatedAt(),
                cheatSheet.getStatus().name().toLowerCase(),
                cheatSheet.getSubmittedBy() != null ? cheatSheet.getSubmittedBy().getId() : null,
                cheatSheet.getApprovedBy() != null ? cheatSheet.getApprovedBy().getId() : null,
                readContent(cheatSheet.getContent())
        );
    }

    private List<String> readTags(String json) {
        return readJson(json, new TypeReference<List<String>>() {});
    }

    private List<SectionDto> readContent(String json) {
        return readJson(json, new TypeReference<List<SectionDto>>() {});
    }

    private <T> T readJson(String json, TypeReference<T> typeReference) {
        try {
            return objectMapper.readValue(json, typeReference);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to read stored cheat sheet JSON.", exception);
        }
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to store cheat sheet JSON.", exception);
        }
    }
}
