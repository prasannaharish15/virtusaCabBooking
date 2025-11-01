package com.secBackend.cab_backend.service;

import com.secBackend.cab_backend.dataTransferObject.DriverLocation;
import com.secBackend.cab_backend.model.User;
import com.secBackend.cab_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CabLocationService {

    // Store driver locations in memory
    private final Map<Long, DriverLocation> driverLocations = new ConcurrentHashMap<>();
    private final UserRepository userRepository;

    // Constructor injection
    public CabLocationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Update driver's location
    public void updateLocation(Long driverId, Double latitude, Double longitude) {
        Optional<User> driver = userRepository.findById(driverId);
        driverLocations.put(driverId, new DriverLocation(driverId, latitude, longitude));
    }

    // Get specific driver's location
    public DriverLocation getLocation(Long driverId) {
        return driverLocations.get(driverId);
    }

    // Get all drivers' locations
    public Map<Long, DriverLocation> getAllLocations() {
        return driverLocations;
    }
}
