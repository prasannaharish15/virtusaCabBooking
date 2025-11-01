package com.secBackend.cab_backend.service;

import com.secBackend.cab_backend.model.RideRequest;
import com.secBackend.cab_backend.model.User;
import com.secBackend.cab_backend.repository.RideRequestRepository;
import com.secBackend.cab_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RideCancelService {

    private final UserRepository userRepository;
    private final RideRequestRepository rideRequestRepository;

    // Constructor injection
    public RideCancelService(UserRepository userRepository, RideRequestRepository rideRequestRepository) {
        this.userRepository = userRepository;
        this.rideRequestRepository = rideRequestRepository;
    }

    // Cancel a ride (driver or customer)
    @Transactional
    public ResponseEntity<?> cancelRide(Long rideId, String email, boolean isDriver) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RideRequest ride = rideRequestRepository.findByIdForUpdate(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getStatus() == RideRequest.RideStatus.COMPLETED) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot cancel a completed ride"));
        }

        if (isDriver) {
            if (!ride.getDriver().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not your ride"));
            }
            ride.setStatus(RideRequest.RideStatus.REJECTED);
        } else {
            if (!ride.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not your ride"));
            }
            ride.setStatus(RideRequest.RideStatus.CANCELLED);
        }

        rideRequestRepository.save(ride);

        // Release driver availability if assigned
        if (ride.getDriver() != null) {
            ride.getDriver().getDriverProfile().setAvailable(true);
            userRepository.save(ride.getDriver());
        }

        return ResponseEntity.ok(Map.of("message", "Ride cancelled"));
    }
}
