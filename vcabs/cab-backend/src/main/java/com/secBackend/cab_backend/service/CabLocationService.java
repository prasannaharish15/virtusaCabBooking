package com.secBackend.cab_backend.service;

import com.secBackend.cab_backend.dataTransferObject.DriverLocation;
import com.secBackend.cab_backend.model.User;
import com.secBackend.cab_backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CabLocationService {

    private static final Logger logger = LoggerFactory.getLogger(CabLocationService.class);
    
    // Store driver locations in memory (can be enhanced with Redis/cache for production)
    private final Map<Long, DriverLocation> driverLocations = new ConcurrentHashMap<>();
    private final UserRepository userRepository;

    // Constructor injection
    public CabLocationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Update driver's location with validation
     * @param driverId - Driver user ID
     * @param latitude - Latitude coordinate
     * @param longitude - Longitude coordinate
     * @throws IllegalArgumentException if coordinates are invalid
     */
    public void updateLocation(Long driverId, Double latitude, Double longitude) {
        // Validate driver exists
        Optional<User> driverOpt = userRepository.findById(driverId);
        if (driverOpt.isEmpty()) {
            logger.warn("Attempted to update location for non-existent driver: {}", driverId);
            throw new IllegalArgumentException("Driver not found with ID: " + driverId);
        }

        // Validate coordinates are not null
        if (latitude == null || longitude == null) {
            logger.error("Invalid location update: null coordinates for driver {}", driverId);
            throw new IllegalArgumentException("Latitude and longitude cannot be null");
        }

        // Validate coordinate ranges
        if (latitude < -90 || latitude > 90) {
            logger.error("Invalid latitude: {} for driver {}", latitude, driverId);
            throw new IllegalArgumentException("Latitude must be between -90 and 90");
        }
        if (longitude < -180 || longitude > 180) {
            logger.error("Invalid longitude: {} for driver {}", longitude, driverId);
            throw new IllegalArgumentException("Longitude must be between -180 and 180");
        }

        // Update location
        DriverLocation location = new DriverLocation(driverId, latitude, longitude);
        driverLocations.put(driverId, location);
        
        logger.debug("Updated location for driver {}: lat={}, lng={}", driverId, latitude, longitude);
    }

    /**
     * Get a specific driver's location
     * @param driverId - Driver user ID
     * @return DriverLocation or null if not found
     */
    public DriverLocation getLocation(Long driverId) {
        if (driverId == null) {
            logger.warn("Attempted to get location with null driver ID");
            return null;
        }
        
        DriverLocation location = driverLocations.get(driverId);
        if (location == null) {
            logger.debug("No location found for driver {}", driverId);
        }
        return location;
    }

    /**
     * Get all drivers' locations
     * @return Map of driver IDs to their locations
     */
    public Map<Long, DriverLocation> getAllLocations() {
        logger.debug("Retrieving locations for {} drivers", driverLocations.size());
        return driverLocations;
    }

    /**
     * Remove driver location (e.g., when driver goes offline)
     * @param driverId - Driver user ID
     */
    public void removeLocation(Long driverId) {
        if (driverId != null) {
            driverLocations.remove(driverId);
            logger.debug("Removed location for driver {}", driverId);
        }
    }
}
