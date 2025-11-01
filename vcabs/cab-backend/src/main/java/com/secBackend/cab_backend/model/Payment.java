//package com.secBackend.cab_backend.model;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.time.LocalDateTime;
//
//@Getter
//@Setter
//
//@Entity
//@Table(name = "payment")
//public class Payment {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private Long rideId;
//    private Long userId;
//    private Double amount;
//    private String currency;
//    private String orderId;
//    private String paymentId;
//    private String status;
//    private LocalDateTime createdAt;
//
//    public Payment() {}
//
//    public Payment(Long rideId, Long userId, Double amount, String currency, String orderId, String status) {
//        this.rideId = rideId;
//        this.userId = userId;
//        this.amount = amount;
//        this.currency = currency;
//        this.orderId = orderId;
//        this.status = status;
//        this.createdAt = LocalDateTime.now();
//    }
//
//    // Getters and Setters
//}
