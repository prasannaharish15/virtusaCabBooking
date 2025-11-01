package com.secBackend.cab_backend.service;

import com.secBackend.cab_backend.dataTransferObject.*;
import com.secBackend.cab_backend.enumerations.Role;
import com.secBackend.cab_backend.model.DriverProfile;
import com.secBackend.cab_backend.model.RideRequest;
import com.secBackend.cab_backend.model.User;
import com.secBackend.cab_backend.repository.DriverProfileRepository;
import com.secBackend.cab_backend.repository.RideRequestRepository;
import com.secBackend.cab_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final RideRequestRepository rideRequestRepository;

    public AdminService(UserRepository userRepository,
                        DriverProfileRepository driverProfileRepository,
                        RideRequestRepository rideRequestRepository) {
        this.userRepository = userRepository;
        this.driverProfileRepository = driverProfileRepository;
        this.rideRequestRepository = rideRequestRepository;
    }

    // Get all customers
    public ResponseEntity<?> getAllCustomer() {
        List<User> users = userRepository.findAllByRole(Role.CUSTOMER);
        if(users.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No user found");
        }
        return ResponseEntity.ok(users);
    }

    // Get all drivers
    public ResponseEntity<?> getAllDriver() {
        List<DriverProfile> drivers = driverProfileRepository.findAll();

        if (drivers.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No drivers found");
        }

        List<DriverDetailDto> driverData = drivers.stream()
                .map(dp -> new DriverDetailDto(
                        dp.getId(),
                        dp.getUser().getId(),
                        dp.getUser().getUsername(),
                        dp.getUser().getEmail(),
                        dp.getUser().getPhoneNumber(),
                        dp.getLicenseNumber(),
                        dp.getVehicleNumber()
                )).toList();

        return ResponseEntity.ok(driverData);
    }

    //  Get active rides (ACCEPTED and IN_PROGRESS)
    public ResponseEntity<?> getRidesByStatus(String status) {
        List<RideRequest> rides = new ArrayList<>();

        switch (status.toUpperCase()) {
            case "ACTIVE" -> {
                rides.addAll(rideRequestRepository.findAllByStatus(RideRequest.RideStatus.ACCEPTED));
                rides.addAll(rideRequestRepository.findAllByStatus(RideRequest.RideStatus.IN_PROGRESS));
            }
            case "COMPLETED" -> rides = rideRequestRepository.findAllByStatus(RideRequest.RideStatus.COMPLETED);
            case "CANCELLED" -> rides = rideRequestRepository.findAllByStatus(RideRequest.RideStatus.CANCELLED);
            default -> {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Invalid ride status"));
            }
        }

        if (rides.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No rides found for status: " + status));
        }

        // Map to appropriate DTOs based on status
        switch (status.toUpperCase()) {
            case "ACTIVE" -> {
                List<ActiveRideAdminDto> activeRides = rides.stream()
                        .map(ride -> new ActiveRideAdminDto(
                                ride.getUser().getId(),
                                ride.getUser().getUsername(),
                                ride.getDriver() != null ? ride.getDriver().getId() : null,
                                ride.getDriver() != null ? ride.getDriver().getUsername() : "N/A",
                                ride.getPickUpLocation(),
                                ride.getDestinationLocation(),
                                ride.getFare()
                        )).toList();
                return ResponseEntity.ok(activeRides);
            }
            case "COMPLETED" -> {
                List<CompletedRideAdminDto> completedRides = rides.stream()
                        .map(ride -> new CompletedRideAdminDto(
                                ride.getUser().getId(),
                                ride.getUser().getUsername(),
                                ride.getDriver() != null ? ride.getDriver().getId() : null,
                                ride.getDriver() != null ? ride.getDriver().getUsername() : "N/A",
                                ride.getPickUpLocation(),
                                ride.getDestinationLocation(),
                                ride.getFare()
                        )).toList();
                return ResponseEntity.ok(completedRides);
            }
            case "CANCELLED" -> {
                List<CancelledRideAdminDto> cancelledRides = rides.stream()
                        .map(ride -> new CancelledRideAdminDto(
                                ride.getUser().getId(),
                                ride.getUser().getUsername(),
                                ride.getDriver() != null ? ride.getDriver().getId() : null,
                                ride.getDriver() != null ? ride.getDriver().getUsername() : "N/A",
                                ride.getPickUpLocation(),
                                ride.getDestinationLocation()
                        )).toList();
                return ResponseEntity.ok(cancelledRides);
            }
            default -> {
                return ResponseEntity.ok(rides);
            }
        }
    }
}
