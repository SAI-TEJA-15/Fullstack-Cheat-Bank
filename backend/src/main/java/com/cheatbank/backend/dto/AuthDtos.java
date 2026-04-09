package com.cheatbank.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class AuthDtos {

    public record RegisterRequest(
            @NotBlank String username,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6) String password
    ) {}

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {}

    public record UserResponse(
            Long id,
            String username,
            String email,
            String role,
            LocalDateTime createdAt
    ) {}

    public record AuthResponse(
            String token,
            UserResponse user
    ) {}

    public record MessageResponse(String message) {}
}
