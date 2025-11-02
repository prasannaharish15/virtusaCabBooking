package com.secBackend.cab_backend.controller;

import com.secBackend.cab_backend.dataTransferObject.DriverLocation;
import com.secBackend.cab_backend.service.CabLocationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cabs")
public class CabLocationController {

    private static final Logger logger = LoggerFactory.getLogger(CabLocationController.class);
    
    private final CabLocationService cabLocationService;

    // Constructor injection
    public CabLocationController(CabLocationService cabLocationService) {
        this.cabLocationService = cabLocationService;
    }

    /**
     * Update driver's location
     * POST /api/cabs/{driverId}/location
     * Body: {"latitude": double, "longitude": double}
     */
    @PostMapping("/{driverId}/location")
    public ResponseEntity<?> updateLocation(
            @PathVariable Long driverId,
            @RequestBody Map<String, Double> payload) {
        try {
            Double latitude = payload.get("latitude");
            Double longitude = payload.get("longitude");
            
            if (latitude == null || longitude == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Latitude and longitude are required"));
            }
            
            cabLocationService.updateLocation(driverId, latitude, longitude);
            logger.info("Location updated for driver {}: lat={}, lng={}", driverId, latitude, longitude);
            return ResponseEntity.ok(Map.of("message", "Location updated successfully"));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid location update request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating location for driver {}: {}", driverId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update location"));
        }
    }

    /**
     * Get specific driver's location
     * GET /api/cabs/{driverId}/location
     */
    @GetMapping("/{driverId}/location")
    public ResponseEntity<?> getLocation(@PathVariable Long driverId) {
        try {
            if (driverId == null || driverId <= 0) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid driver ID"));
            }
            
            DriverLocation location = cabLocationService.getLocation(driverId);
            if (location == null) {
                logger.debug("Location not found for driver {}", driverId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Location not found for driver " + driverId));
            }
            return ResponseEntity.ok(location);
        } catch (Exception e) {
            logger.error("Error retrieving location for driver {}: {}", driverId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve location"));
        }
    }

    /**
     * Get all drivers' locations
     * GET /api/cabs/locations
     */
    @GetMapping("/locations")
    public ResponseEntity<?> getAllLocations() {
        try {
            Map<Long, DriverLocation> locations = cabLocationService.getAllLocations();
            return ResponseEntity.ok(locations);
        } catch (Exception e) {
            logger.error("Error retrieving all locations: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve locations"));
        }
    }
}
