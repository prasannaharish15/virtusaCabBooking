package com.secBackend.cab_backend.controller;

import com.secBackend.cab_backend.dataTransferObject.RideRequestDto;
import com.secBackend.cab_backend.service.RideCancelService;
import com.secBackend.cab_backend.service.RideHistoryService;
import com.secBackend.cab_backend.service.RideRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/rides")
public class RideRequestController {

    private final RideRequestService rideRequestService;
    private final RideCancelService rideCancelService;
    private final RideHistoryService rideHistoryService;

    // Constructor injection
    public RideRequestController(RideRequestService rideRequestService, RideCancelService rideCancelService, RideHistoryService rideHistoryService) {
        this.rideRequestService = rideRequestService;
        this.rideCancelService = rideCancelService;
        this.rideHistoryService = rideHistoryService;
    }

    // Customer requests a ride
    @PostMapping("/request")
    public ResponseEntity<?> requestRide(@RequestBody RideRequestDto rideRequestDto, Authentication authentication) {
        String email = authentication.getName();
        return rideRequestService.createRide(rideRequestDto, email);
    }

    // Customer cancels a ride
    @PostMapping("/{rideId}/cancel")
    public ResponseEntity<?> cancelRideByCustomer(@PathVariable Long rideId, Authentication auth) {
        return rideCancelService.cancelRide(rideId, auth.getName(), false);
    }

    // Customer ride history
    @GetMapping("/history")
    public ResponseEntity<?> customerRideHistory(Authentication auth) {
        return rideHistoryService.getCustomerHistory(auth.getName());
    }
}
