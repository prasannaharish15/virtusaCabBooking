package com.secBackend.cab_backend.controller;

import com.secBackend.cab_backend.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final CustomerService customerService;
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // Customer home greeting
    @GetMapping("/homepage")
    public ResponseEntity<?> customerHomePage(Authentication authentication ){

        return customerService.getCustomerHomePage(authentication.getName());
    }

    @GetMapping("/ridehistory")
    public ResponseEntity<?> customerRideHistory(Authentication authentication){
        return customerService.getCustomerRideHistory(authentication.getName());
    }
    @GetMapping("/rides/{rideId}")
    public ResponseEntity<?> getCustomerCurrentRide(@PathVariable("rideId") String rideId){
        return customerService.getCustomerCurrentRide(rideId);
    }

    // Get customer's active ride if exists
    @GetMapping("/rides/active")
    public ResponseEntity<?> getCustomerActiveRide(Authentication authentication){
        return customerService.getCustomerActiveRide(authentication.getName());
    }
}
