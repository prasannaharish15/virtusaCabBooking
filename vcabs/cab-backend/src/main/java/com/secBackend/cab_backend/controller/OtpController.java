package com.secBackend.cab_backend.controller;
import com.secBackend.cab_backend.service.EmailService;
import com.secBackend.cab_backend.service.OtpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    private final OtpService otpService;
    private final EmailService emailService;

    public OtpController(OtpService otpService, EmailService emailService) {
        this.otpService = otpService;
        this.emailService = emailService;
    }

    @PostMapping("/generateotp/{emailId}")
    public ResponseEntity<?> generateOtp(@PathVariable String emailId){
        String otp = otpService.generateOtp(emailId);
        emailService.sendEmail(emailId, otp);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message","otp generated successfully for "+emailId));
    }
    @PostMapping("/verifyotp/{emailId}/{otp}")
    public ResponseEntity<?> verifyOtp(@PathVariable String emailId, @PathVariable String otp) {
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message",otpService.verifyOtp(emailId, otp))) ;

    }
}