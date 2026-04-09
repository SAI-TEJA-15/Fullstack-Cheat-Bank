package com.cheatbank.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDateTime;
import java.util.List;

public class CheatSheetDtos {

    public record CommandDto(
            @NotBlank String command,
            @NotBlank String description
    ) {}

    public record SectionDto(
            @NotBlank String title,
            @Valid @NotEmpty List<CommandDto> commands
    ) {}

    public record CheatSheetRequest(
            @NotBlank String title,
            @NotBlank String description,
            @NotBlank String category,
            @NotBlank String authorName,
            @NotEmpty List<String> tags,
            @Valid @NotEmpty List<SectionDto> content
    ) {}

    public record AuthorDto(String name) {}

    public record StatsDto(Integer views, Integer downloads) {}

    public record CheatSheetResponse(
            Long id,
            String title,
            String description,
            String category,
            List<String> tags,
            AuthorDto author,
            StatsDto stats,
            LocalDateTime createdAt,
            String status,
            Long submittedBy,
            Long approvedBy,
            List<SectionDto> content
    ) {}

    public record CheatSheetListResponse(List<CheatSheetResponse> cheatSheets) {}

    public record SingleCheatSheetResponse(CheatSheetResponse cheatSheet) {}
}
