package com.cheatbank.backend.config;

import com.cheatbank.backend.dto.CheatSheetDtos.CommandDto;
import com.cheatbank.backend.dto.CheatSheetDtos.SectionDto;
import com.cheatbank.backend.model.CheatSheet;
import com.cheatbank.backend.model.CheatSheetStatus;
import com.cheatbank.backend.model.User;
import com.cheatbank.backend.model.UserRole;
import com.cheatbank.backend.repository.CheatSheetRepository;
import com.cheatbank.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner seedDefaults(
            UserRepository userRepository,
            CheatSheetRepository cheatSheetRepository,
            PasswordEncoder passwordEncoder,
            ObjectMapper objectMapper
    ) {
        return args -> {
            try {
                User admin = userRepository.findByEmail("admin@cheatbank.com").orElseGet(() -> {
                    User user = new User();
                    user.setUsernameValue("Admin");
                    user.setEmail("admin@cheatbank.com");
                    user.setPasswordHash(passwordEncoder.encode("admin123"));
                    user.setRole(UserRole.ADMIN);
                    return userRepository.save(user);
                });

                boolean hasApprovedSheet = cheatSheetRepository.findByStatusOrderByCreatedAtDesc(CheatSheetStatus.APPROVED)
                        .stream()
                        .findAny()
                        .isPresent();

                if (!hasApprovedSheet) {
                    CheatSheet cheatSheet = new CheatSheet();
                    cheatSheet.setTitle("Git Commands");
                    cheatSheet.setDescription("Essential Git commands for version control, branching, and history.");
                    cheatSheet.setCategory("Development");
                    cheatSheet.setAuthorName("Admin");
                    cheatSheet.setTags(objectMapper.writeValueAsString(List.of("git", "version-control", "cli")));
                    cheatSheet.setContent(objectMapper.writeValueAsString(List.of(
                            new SectionDto(
                                    "Basic Commands",
                                    List.of(
                                            new CommandDto("git init", "Initialize a repository"),
                                            new CommandDto("git status", "Show the current working tree status"),
                                            new CommandDto("git push", "Push commits to the remote branch")
                                    )
                            ),
                            new SectionDto(
                                    "Branching",
                                    List.of(
                                            new CommandDto("git branch feature-x", "Create a branch"),
                                            new CommandDto("git checkout feature-x", "Switch branches")
                                    )
                            )
                    )));
                    cheatSheet.setSubmittedBy(admin);
                    cheatSheet.setApprovedBy(admin);
                    cheatSheet.setStatus(CheatSheetStatus.APPROVED);
                    cheatSheet.setApprovedAt(LocalDateTime.now());
                    cheatSheet.setViews(120);
                    cheatSheet.setDownloads(48);
                    cheatSheet.setUpdatedAt(LocalDateTime.now());
                    cheatSheetRepository.save(cheatSheet);
                }
            } catch (Exception exception) {
                logger.warn("Skipping default data seed because the database is not fully ready yet: {}", exception.getMessage());
            }
        };
    }
}
