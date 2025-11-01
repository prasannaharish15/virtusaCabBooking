package com.secBackend.cab_backend.controller;

import com.secBackend.cab_backend.service.DriverRideService;
import com.secBackend.cab_backend.service.RideCancelService;
import com.secBackend.cab_backend.service.RideHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/driver")
public class DriverRideController {

    private final DriverRideService driverRideService;
    private final RideCancelService rideCancelService;
    private final RideHistoryService rideHistoryService;

    // Constructor injection
    public DriverRideController(DriverRideService driverRideService, RideCancelService rideCancelService, RideHistoryService rideHistoryService) {
        this.driverRideService = driverRideService;
        this.rideCancelService = rideCancelService;
        this.rideHistoryService = rideHistoryService;
    }
    @GetMapping("/accepted")
    public ResponseEntity<?> getAcceptedDriverRide(Authentication authentication) {
        return driverRideService.getAcceptedDriverRide(authentication.getName());

    }

    // Start a ride
    @PostMapping("/{rideId}/start")
    public ResponseEntity<?> startRide(@PathVariable Long rideId, Authentication auth) {
        return driverRideService.startRide(rideId, auth.getName());
    }

    // Complete a ride
    @PostMapping("/{rideId}/complete")
    public ResponseEntity<?> completeRide(@PathVariable Long rideId, Authentication auth) {
        return driverRideService.completeRide(rideId, auth.getName());
    }

    // Cancel ride by driver
    @PostMapping("/{rideId}/cancel")
    public ResponseEntity<?> cancelRideByDriver(@PathVariable Long rideId, Authentication auth) {
        return rideCancelService.cancelRide(rideId, auth.getName(), true);
    }

    // Get driver ride history
    @GetMapping("/history")
    public ResponseEntity<?> driverRideHistory(Authentication auth) {
        return rideHistoryService.getDriverHistory(auth.getName());
    }
    @GetMapping("/getPendingRide/{type}")
    public ResponseEntity<?> getPendingRides(@PathVariable("type") String type, Authentication auth) {
        // 'auth.getName()' returns the username/email of the authenticated driver
        return driverRideService.getPendingRides(type, auth.getName());
    }
}
