package com.secBackend.cab_backend.service;

import com.secBackend.cab_backend.Util.GeoUtil;
import com.secBackend.cab_backend.dataTransferObject.RideRequestDto;
import com.secBackend.cab_backend.dataTransferObject.RideResponseDto;
import com.secBackend.cab_backend.dataTransferObject.DriverLocation;
import com.secBackend.cab_backend.enumerations.RideType;
import com.secBackend.cab_backend.enumerations.Role;
import com.secBackend.cab_backend.model.RideRequest;
import com.secBackend.cab_backend.model.User;
import com.secBackend.cab_backend.repository.RideRequestRepository;
import com.secBackend.cab_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class RideRequestService {

    private final RideRequestRepository rideRequestRepository;
    private final UserRepository userRepository;
    private final CabLocationService cabLocationService;

    public RideRequestService(RideRequestRepository rideRequestRepository,
                              UserRepository userRepository,
                              CabLocationService cabLocationService) {
        this.rideRequestRepository = rideRequestRepository;
        this.userRepository = userRepository;
        this.cabLocationService = cabLocationService;
    }

    public ResponseEntity<?> createRide(RideRequestDto dto, String email) {

        // Add logging to debug
        System.out.println("=== RECEIVED RIDE REQUEST ===");
        System.out.println("Email: " + email);
        System.out.println("RideType: " + dto.getRideType());
        System.out.println("PickUpLocation: " + dto.getPickUpLocation());
        System.out.println("DropOffLocation: " + dto.getDropOffLocation());
        System.out.println("DistanceKm: " + dto.getDistanceKm());
        System.out.println("Minutes: " + dto.getMinitues());
        System.out.println("Fare: " + dto.getFare());
        System.out.println("CabType: " + dto.getCabType());
        System.out.println("Number of Customers: " + dto.getNumberOfCustomers());
        System.out.println("=== END REQUEST DATA ===");

        // 1️⃣ Validate user
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2️⃣ Check if user already has active ride
        List<RideRequest> checkCustomerAlreadyInRide = rideRequestRepository.findAllByUser_Id(customer.getId());
        boolean hasActiveRide = checkCustomerAlreadyInRide.stream()
                .anyMatch(r ->
                        r.getStatus() == RideRequest.RideStatus.ACCEPTED ||
                                r.getStatus() == RideRequest.RideStatus.IN_PROGRESS
                );

        if (hasActiveRide) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "You already have an active ride!"));
        }

        // 3️⃣ Determine ride type - WITH NULL SAFETY
        RideType rideType;
        try {
            String rideTypeStr = dto.getRideType();
            if (rideTypeStr == null || rideTypeStr.trim().isEmpty()) {
                // Default to LOCAL if not provided
                rideType = RideType.LOCAL;
                System.out.println("RideType was null, defaulting to LOCAL");
            } else {
                rideType = RideType.valueOf(rideTypeStr.toUpperCase());
                System.out.println("Using provided RideType: " + rideType);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid ride type: " + dto.getRideType()));
        }

        // 4️⃣ Use frontend-provided distance and duration
        double distance = dto.getDistanceKm();
        double duration = dto.getMinitues();

        // 5️⃣ Handle ride type-specific validation
        if (rideType == RideType.LOCAL && distance > 25) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Local rides cannot exceed 25 km."));
        }

        if (rideType == RideType.INTERCITY && distance < 25) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Intercity rides must exceed 25 km."));
        }

        if (rideType == RideType.ADVANCE && dto.getScheduledTime() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Scheduled time required for advance booking."));
        }

        if (rideType == RideType.RENTAL && dto.getRentalHours() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Please specify valid rental hours."));
        }

        // 6️⃣ Fare calculation - use frontend calculated fare or calculate based on distance
        double estimatedFare;
        if (dto.getFare() > 0) {
            // Use frontend-provided fare
            estimatedFare = dto.getFare();
        } else {
            // Calculate fare if not provided
            double baseFare;
            String cabType = dto.getCabType();
            if (cabType == null) {
                cabType = "MINI"; // Default cab type
            }

            switch (cabType.toUpperCase()) {
                case "SEDAN" -> baseFare = 15;
                case "SUV" -> baseFare = 20;
                default -> baseFare = 10;
            }

            estimatedFare = switch (rideType) {
                case LOCAL -> baseFare * distance;
                case INTERCITY -> (baseFare * distance) + 100;
                case ADVANCE -> (baseFare * distance) * 1.1;
                case RENTAL -> baseFare * dto.getRentalHours() * 15;
            };
        }

        // 7️⃣ Create Ride entity
        RideRequest rideRequest = new RideRequest();
        rideRequest.setRideType(rideType);
        rideRequest.setPickUpLocation(dto.getPickUpLocation());
        rideRequest.setDestinationLocation(dto.getDropOffLocation());
        rideRequest.setPickUpLatitude(dto.getPickUpLatitude());
        rideRequest.setPickUpLongitude(dto.getPickUpLongitude());
        rideRequest.setDestinationLatitude(dto.getDropOffLatitude());
        rideRequest.setDestinationLongitude(dto.getDropOffLongitude());
        rideRequest.setDistanceKm(distance);
        rideRequest.setDurationMinutes((int) duration);
        rideRequest.setFare((int) estimatedFare);
        rideRequest.setRequestedAt(LocalDateTime.now());
        rideRequest.setUser(customer);
        rideRequest.setRentalHours(dto.getRentalHours());
        rideRequest.setScheduledTime(dto.getScheduledTime());
        rideRequest.setCabType(dto.getCabType());

        // 8️⃣ Auto assign driver only for immediate rides
        if (rideType == RideType.ADVANCE) {
            rideRequest.setStatus(RideRequest.RideStatus.REQUESTED);
        } else {
            Optional<User> nearestDriver = findNearestAvailableDriver(
                    dto.getPickUpLatitude(), dto.getPickUpLongitude(), 5);

            if (nearestDriver.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "No driver available now. Please try again later."));
            }

            rideRequest.setDriver(nearestDriver.get());
            rideRequest.setAcceptedAt(LocalDateTime.now());
            rideRequest.setStatus(RideRequest.RideStatus.ACCEPTED);
        }

        RideRequest saved = rideRequestRepository.save(rideRequest);

        RideResponseDto response = new RideResponseDto();
        response.setRideId(saved.getId());
        response.setDistance(saved.getDistanceKm());
        response.setDurationMinutes(saved.getDurationMinutes());
        response.setFare(saved.getFare());
        response.setStatus(saved.getStatus().name());

        System.out.println("=== BOOKING CREATED SUCCESSFULLY ===");
        System.out.println("Ride ID: " + saved.getId());
        System.out.println("Status: " + saved.getStatus());
        System.out.println("Fare: " + saved.getFare());
        System.out.println("=== END SUCCESS RESPONSE ===");

        return ResponseEntity.ok(response);
    }

    private Optional<User> findNearestAvailableDriver(double lat, double lon, double maxKm) {
        return userRepository.findAllByRole(Role.DRIVER).stream()
                .filter(d -> d.getDriverProfile() != null && d.getDriverProfile().isAvailable())
                .map(d -> {
                    DriverLocation loc = cabLocationService.getLocation(d.getId());
                    return loc != null ? Map.entry(d, loc) : null;
                })
                .filter(Objects::nonNull)
                .filter(entry -> rideRequestRepository.findAllByDriver_Id(entry.getKey().getId()).stream()
                        .noneMatch(r -> r.getStatus() == RideRequest.RideStatus.ACCEPTED ||
                                r.getStatus() == RideRequest.RideStatus.IN_PROGRESS))
                .filter(entry -> GeoUtil.distanceInKm(
                        lat, lon,
                        entry.getValue().getLatitude(), entry.getValue().getLongitude()
                ) <= maxKm)
                .min(Comparator.comparingDouble(entry ->
                        GeoUtil.distanceInKm(lat, lon,
                                entry.getValue().getLatitude(), entry.getValue().getLongitude())
                ))
                .map(Map.Entry::getKey);
    }
}   