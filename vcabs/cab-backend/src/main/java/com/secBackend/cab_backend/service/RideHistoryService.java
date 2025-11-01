package com.secBackend.cab_backend.service;

import com.secBackend.cab_backend.dataTransferObject.HistoryDTO;
import com.secBackend.cab_backend.model.RideRequest;
import com.secBackend.cab_backend.model.User;
import com.secBackend.cab_backend.repository.RideRequestRepository;
import com.secBackend.cab_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RideHistoryService {

    private final UserRepository userRepository;
    private final RideRequestRepository rideRequestRepository;

    // Constructor injection
    public RideHistoryService(UserRepository userRepository, RideRequestRepository rideRequestRepository) {
        this.userRepository = userRepository;
        this.rideRequestRepository = rideRequestRepository;
    }


    // Get ride history for driver
    public ResponseEntity<?> getDriverHistory(String email) {
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        List<RideRequest> rides = rideRequestRepository.findAllByDriver_Id(driver.getId());
        if (rides.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No rides found"));
        }

        // Map rides to DriverHistoryDTO
        List<HistoryDTO> driverHistory = rides.stream()
                .map(his -> new HistoryDTO(
                        his.getId(),
                        his.getUser().getId(),
                        his.getUser().getUsername(),
                        his.getUser().getPhoneNumber(),
                        his.getPickUpLocation(),
                        his.getDestinationLocation(),
                        his.getAcceptedAt(),
                        his.getStartedAt(),
                        his.getCompletedAt(),
                        his.getDistanceKm(),
                        (double) his.getDurationMinutes(),
                        his.getFare(),
                        his.getStatus().name()
                ))
                .toList();

        return ResponseEntity.ok(driverHistory);
    }
}
