package com.secBackend.cab_backend.controller;
import com.secBackend.cab_backend.service.EmailService;
import com.secBackend.cab_backend.service.OtpService;
import org.springframework.web.bind.annotation.*;

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
    public String generateOtp(@PathVariable String emailId){
        String otp = otpService.generateOtp(emailId);
        emailService.sendEmail(emailId, otp);
        return "OTP sent successfully to " + emailId;
    }
    @PostMapping("/verifyotp/{emailId}/{otp}")
    public boolean verifyOtp(@PathVariable String emailId, @PathVariable String otp) {
        return otpService.verifyOtp(emailId, otp);

    }
}