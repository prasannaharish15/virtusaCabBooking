package com.secBackend.cab_backend.service;

import com.secBackend.cab_backend.dataTransferObject.RideResponseDto;
import com.secBackend.cab_backend.enumerations.RideType;
import com.secBackend.cab_backend.model.RideRequest;
import com.secBackend.cab_backend.model.User;
import com.secBackend.cab_backend.repository.RideRequestRepository;
import com.secBackend.cab_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DriverRideService {

    private final RideRequestRepository rideRequestRepository;
    private final UserRepository userRepository;

    // Constructor injection
    public DriverRideService(RideRequestRepository rideRequestRepository,
                             UserRepository userRepository) {
        this.rideRequestRepository = rideRequestRepository;
        this.userRepository = userRepository;

    }

    // Start a ride
    @Transactional
    public ResponseEntity<?> startRide(Long rideId, String email) {
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        RideRequest ride = rideRequestRepository.findByIdForUpdate(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (!ride.getDriver().getId().equals(driver.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not your ride"));
        }

        if (ride.getStatus() != RideRequest.RideStatus.ACCEPTED) {
            return ResponseEntity.badRequest().body(Map.of("message", "Ride must be ACCEPTED to start"));
        }

        ride.setStatus(RideRequest.RideStatus.IN_PROGRESS);
        ride.setStartedAt(LocalDateTime.now());
        rideRequestRepository.save(ride);

        return ResponseEntity.ok(Map.of("message", "Ride started"));
    }

    // Complete a ride
    @Transactional
    public ResponseEntity<?> completeRide(Long rideId, String email) {
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        RideRequest ride = rideRequestRepository.findByIdForUpdate(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (!ride.getDriver().getId().equals(driver.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not your ride"));
        }

        if (ride.getStatus() != RideRequest.RideStatus.IN_PROGRESS) {
            return ResponseEntity.badRequest().body(Map.of("message", "Ride must be IN_PROGRESS to complete"));
        }

        ride.setStatus(RideRequest.RideStatus.COMPLETED);
        ride.setCompletedAt(LocalDateTime.now());
        rideRequestRepository.save(ride);

        // Make driver available again
        driver.getDriverProfile().setAvailable(true);
        userRepository.save(driver);

        return ResponseEntity.ok(Map.of("message", "Ride completed"));
    }


    public ResponseEntity<?> getPendingRides(String type, String driverName) {
        List<RideRequest> rides;

        // Filter based on a ride type
        if ("ADVANCE".equalsIgnoreCase(type)) {
            rides = rideRequestRepository.findAllByRideTypeAndStatusAndScheduledTimeAfter(
                    RideType.ADVANCE, RideRequest.RideStatus.REQUESTED, LocalDateTime.now());
        } else if ("RENTAL".equalsIgnoreCase(type)) {
            rides = rideRequestRepository.findAllByRideTypeAndStatusAndScheduledTimeAfter(
                    RideType.RENTAL, RideRequest.RideStatus.REQUESTED, LocalDateTime.now());
        } else if ("INTERCITY".equalsIgnoreCase(type)) {
            rides = rideRequestRepository.findAllByRideTypeAndStatusAndScheduledTimeAfter(
                    RideType.INTERCITY, RideRequest.RideStatus.REQUESTED, LocalDateTime.now());
        } else {
            return ResponseEntity.badRequest().body("Invalid ride type: " + type);
        }

        // Convert Entity → DTO
        List<RideResponseDto> responseDtoList = rides.stream().map(ride -> {
            RideResponseDto dto = new RideResponseDto();
            dto.setRideId(ride.getId());
            dto.setDistance(ride.getDistanceKm());
            dto.setDurationMinutes(ride.getDurationMinutes());
            dto.setFare(ride.getFare());
            dto.setStatus(String.valueOf(ride.getStatus()));
            dto.setPickUpLocation(ride.getPickUpLocation());
            dto.setDestinationLocation(ride.getDestinationLocation());
            dto.setScheduledDateTime(ride.getScheduledTime());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responseDtoList);
    }

    public ResponseEntity<?> getAcceptedDriverRide(String email) {
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        RideRequest currRide=rideRequestRepository.findByDriver_IdAndStatus(driver.getId(), RideRequest.RideStatus.ACCEPTED);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", currRide));
    }
}
