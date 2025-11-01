package com.secBackend.cab_backend.controller;

import com.secBackend.cab_backend.dataTransferObject.DriverAvailabilityDto;
import com.secBackend.cab_backend.dataTransferObject.DriverDetailDto;
import com.secBackend.cab_backend.dataTransferObject.RegisterUserRequest;
import com.secBackend.cab_backend.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/driver")
public class DriverController {

    private final DriverService driverService;

    // Constructor injection
    public DriverController(DriverService driverService){
        this.driverService = driverService;
    }

    // Update driver availability
    @PostMapping("/availability")
    public ResponseEntity<?> updateDriverAvailability(Authentication authentication,
                                                      @RequestBody DriverAvailabilityDto driverAvailabilityDto) {
        return driverService.setDriverAvailability(authentication.getName(), driverAvailabilityDto.isAvailable());
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

    @PostMapping("/{driverId}/start")
    public ResponseEntity<?> startRide(@PathVariable Long driverId) {
        return driverService.startRide(driverId);
    }

    @PostMapping("/{driverId}/end")
    public ResponseEntity<?> endRide(@PathVariable Long driverId) {
        return driverService.endRide(driverId);
    }

}
