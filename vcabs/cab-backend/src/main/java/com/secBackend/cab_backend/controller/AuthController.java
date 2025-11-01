package com.secBackend.cab_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.secBackend.cab_backend.exception.InvalidPasswordException;
import com.secBackend.cab_backend.exception.UserAlreadyExistsException;
import com.secBackend.cab_backend.exception.UserNotFoundException;
import com.secBackend.cab_backend.Util.JwtUtil;
import com.secBackend.cab_backend.dataTransferObject.LoginRequest;
import com.secBackend.cab_backend.dataTransferObject.RegisterUserRequest;
import com.secBackend.cab_backend.model.User;
import com.secBackend.cab_backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    // Constructor injection
    public AuthController(AuthService authService, BCryptPasswordEncoder bCryptPasswordEncoder, JwtUtil jwtUtil) {
        this.authService = authService;
        this.passwordEncoder = bCryptPasswordEncoder;
        this.jwtUtil = jwtUtil;
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterUserRequest registerUserRequest)  {
        System.out.println("registerUser"+registerUserRequest);
        if(authService.findEmail(registerUserRequest.getEmail()).isPresent() ||
                authService.findPhonenumber(registerUserRequest.getPhoneNumber()).isPresent()
        ){
            throw new UserAlreadyExistsException("Email or Phone number already exists!");
        }
        return ResponseEntity.status(HttpStatus.OK).body(authService.registerUser(registerUserRequest));
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        System.out.println("loginRequest"+loginRequest);
        Optional<User> existingUser = authService.findEmail(loginRequest.getEmail());
        if(existingUser.isEmpty()){
            throw new UserNotFoundException("Email not found!");
        }
        User dbUser = existingUser.get();
        if(!passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPassword())){
            throw new InvalidPasswordException("Password does not match!");
        }
        // Generate JWT token
        String token = jwtUtil.generateToken(dbUser.getEmail(), dbUser.getRole());
        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "token", token,
                "role", dbUser.getRole(),
                "email", dbUser.getEmail()
        ));
    }
}
