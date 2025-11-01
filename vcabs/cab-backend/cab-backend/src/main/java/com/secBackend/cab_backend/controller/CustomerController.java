package com.secBackend.cab_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    // Customer home greeting
    @GetMapping("/home")
    public ResponseEntity<?> customerGreet(Authentication authentication ){
        return ResponseEntity.status(HttpStatus.OK)
                .body(Map.of("message","Hello "+authentication.getName()));
    }
}
