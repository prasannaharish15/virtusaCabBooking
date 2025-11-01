//package com.secBackend.cab_backend.controller;
//
//import com.secBackend.cab_backend.dataTansferObject.*;
//import com.secBackend.cab_backend.service.PaymentService;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/payment")
//public class PaymentController {
//
//    private final PaymentService paymentService;
//
//    public PaymentController(PaymentService paymentService) {
//        this.paymentService = paymentService;
//    }
//
//    // Create Razorpay Order
//    @PostMapping("/create-order")
//    public PaymentResponseDto createOrder(@RequestBody PaymentRequestDto request) {
//        return paymentService.createOrder(request);
//    }
//
//    // Verify Razorpay Payment
//    @PostMapping("/verify")
//    public String verifyPayment(@RequestBody PaymentVerificationDto request) {
//        return paymentService.verifyPayment(request);
//    }
//}
