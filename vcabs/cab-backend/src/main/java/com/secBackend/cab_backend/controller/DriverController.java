package com.secBackend.cab_backend.controller;

import com.secBackend.cab_backend.dataTransferObject.DriverAvailabilityDto;
import com.secBackend.cab_backend.dataTransferObject.DriverDetailDto;
import com.secBackend.cab_backend.dataTransferObject.RegisterUserRequest;
import com.secBackend.cab_backend.service.DriverService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/driver")
public class DriverController {

    private final DriverService driverService;

    // Constructor injection
    public DriverController(DriverService driverService){
        this.driverService = driverService;
    }

    /**
     * Update driver availability
     * POST /api/driver/availability
     * Body: {"available": boolean}
     */
    @PostMapping("/availability")
    public ResponseEntity<?> updateDriverAvailability(Authentication authentication,
                                                      @RequestBody DriverAvailabilityDto driverAvailabilityDto) {
        try {
            if (driverAvailabilityDto == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Request body cannot be null"));
            }
            
            String email = authentication.getName();
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication failed"));
            }
            
            return driverService.setDriverAvailability(email, driverAvailabilityDto.isAvailable());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update availability", "message", e.getMessage()));
        }
    }
    // get driver detail
    @GetMapping("/profiledata")
    public ResponseEntity<?> getProfileData(Authentication authentication) {
        return driverService.getProfileData(authentication.getName());
    }
    @PostMapping("/updatedriverprofile")
    public ResponseEntity<?> updateDriverProfile(
            @RequestBody RegisterUserRequest registerUserRequest,
            Authentication authentication) {

        return driverService.updateDriverProfile(registerUserRequest, authentication.getName());
    }

    @GetMapping("/driverhomepage")
    public ResponseEntity<?> getDriverHomePage(Authentication authentication) {
        return driverService.getDriverHomePageData(authentication.getName());
    }



    @PostMapping("/{driverId}/end")
    public ResponseEntity<?> endRide(@PathVariable Long driverId) {
        return driverService.endRide(driverId);
    }

}
