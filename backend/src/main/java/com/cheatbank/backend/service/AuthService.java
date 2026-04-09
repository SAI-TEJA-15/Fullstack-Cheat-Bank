package com.cheatbank.backend.service;

import com.cheatbank.backend.dto.AuthDtos.AuthResponse;
import com.cheatbank.backend.dto.AuthDtos.LoginRequest;
import com.cheatbank.backend.dto.AuthDtos.MessageResponse;
import com.cheatbank.backend.dto.AuthDtos.RegisterRequest;
import com.cheatbank.backend.dto.AuthDtos.UserResponse;
import com.cheatbank.backend.model.User;
import com.cheatbank.backend.model.UserRole;
import com.cheatbank.backend.repository.UserRepository;
import com.cheatbank.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public MessageResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        User user = new User();
        user.setUsernameValue(request.username().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.USER);

        userRepository.save(user);

        return new MessageResponse("Registration successful. Please sign in.");
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        String token = jwtService.generateToken(user, Map.of(
                "role", user.getRole().name().toLowerCase(),
                "userId", user.getId()
        ));

        return new AuthResponse(token, mapUser(user));
    }

    public UserResponse me(User user) {
        return mapUser(user);
    }

    private UserResponse mapUser(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsernameValue(),
                user.getEmail(),
                user.getRole().name().toLowerCase(),
                user.getCreatedAt()
        );
    }
}
