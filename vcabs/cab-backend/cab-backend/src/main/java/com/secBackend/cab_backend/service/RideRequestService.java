package com.secBackend.cab_backend.service;

import com.secBackend.cab_backend.Util.GeoUtil;
import com.secBackend.cab_backend.dataTransferObject.RideRequestDto;
import com.secBackend.cab_backend.dataTransferObject.RideResponseDto;
import com.secBackend.cab_backend.dataTransferObject.RouteResult;
import com.secBackend.cab_backend.dataTransferObject.DriverLocation;
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
    private final RouteService routeService;
    private final UserRepository userRepository;
    private final CabLocationService cabLocationService;

    public RideRequestService(RideRequestRepository rideRequestRepository,
                              RouteService routeService,
                              UserRepository userRepository,
                              CabLocationService cabLocationService) {
        this.rideRequestRepository = rideRequestRepository;
        this.routeService = routeService;
        this.userRepository = userRepository;
        this.cabLocationService = cabLocationService;
    }


public ResponseEntity<?> createRide(RideRequestDto rideRequestDto, String email) {


    // 1. Calculate route details
    RouteResult route = routeService.getRoute(
            rideRequestDto.getPickUpLongitude(),
            rideRequestDto.getPickUpLatitude(),
            rideRequestDto.getDropOffLongitude(),
            rideRequestDto.getDropOffLatitude()
    );

    // 2. Estimate fare
    double baseFare;
    switch (rideRequestDto.getCabType().toUpperCase()) {
        case "SEDAN" -> baseFare = 15;
        case "SUV" -> baseFare = 20;
        default -> baseFare = 10; // MINI
    }
    double estimatedFare = baseFare * route.getDistanceKm();

    // 3. Validate customer
    User customer = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    List<RideRequest> checkCustomerAlreadyInRide=rideRequestRepository.findAllByUser_Id(customer.getId());
    boolean hasActiveRide=checkCustomerAlreadyInRide.stream().
            anyMatch(r->
                    r.getStatus()==RideRequest.RideStatus.ACCEPTED||
                    r.getStatus()==RideRequest.RideStatus.IN_PROGRESS
            );

    if (hasActiveRide) {
        throw new RuntimeException("You already have an active ride!");
    }


    // 4. Create ride request object
    RideRequest rideRequest = new RideRequest();
    rideRequest.setPickUpLocation(rideRequestDto.getPickUpLocation());
    rideRequest.setDestinationLocation(rideRequestDto.getDropOffLocation());
    rideRequest.setPickUpLatitude(rideRequestDto.getPickUpLatitude());
    rideRequest.setPickUpLongitude(rideRequestDto.getPickUpLongitude());
    rideRequest.setDestinationLatitude(rideRequestDto.getDropOffLatitude());
    rideRequest.setDestinationLongitude(rideRequestDto.getDropOffLongitude());
    rideRequest.setDistanceKm(route.getDistanceKm());
    rideRequest.setDurationMinutes((int) route.getDurationMinutes());
    rideRequest.setFare((int) estimatedFare);
    rideRequest.setRequestedAt(LocalDateTime.now());
    rideRequest.setUser(customer);

    // 5. Try to auto-assign the nearest available driver
    Optional<User> nearestDriver = findNearestAvailableDriver(
            rideRequestDto.getPickUpLatitude(),
            rideRequestDto.getPickUpLongitude(),
            5 // max distance in km
    );

    if (nearestDriver.isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "No driver available right now. Please try again later."));
    }

    rideRequest.setStatus(RideRequest.RideStatus.ACCEPTED);
    rideRequest.setDriver(nearestDriver.get());
    rideRequest.setAcceptedAt(LocalDateTime.now());

    // 6. Save and return response
    RideRequest saved = rideRequestRepository.save(rideRequest);

    RideResponseDto response = new RideResponseDto();
    response.setRideId(saved.getId());
    response.setDistance(saved.getDistanceKm());
    response.setDurationMinutes(saved.getDurationMinutes());
    response.setFare(saved.getFare());
    response.setStatus(saved.getStatus().name());

    return ResponseEntity.ok(response);
}


    private Optional<User> findNearestAvailableDriver(double lat, double lon, double maxKm) {
        return userRepository.findAllByRole(Role.DRIVER).stream()
                // must have driver profile and marked available
                .filter(d -> d.getDriverProfile() != null && d.getDriverProfile().isAvailable())
                // must have valid location
                .map(d -> {
                    DriverLocation loc = cabLocationService.getLocation(d.getId());
                    return loc != null ? Map.entry(d, loc) : null;
                })
                .filter(entry->entry != null)
                // skip drivers already on an active ride
                .filter(entry -> rideRequestRepository.findAllByDriver_Id(entry.getKey().getId()).stream()
                        .noneMatch(r -> r.getStatus() == RideRequest.RideStatus.ACCEPTED ||
                                r.getStatus() == RideRequest.RideStatus.IN_PROGRESS))
                // ensure within maxKm
                .filter(entry -> GeoUtil.distanceInKm(
                        lat, lon,
                        entry.getValue().getLatitude(), entry.getValue().getLongitude()
                ) <= maxKm)
                // find the nearest driver
                .min(Comparator.comparingDouble(entry ->
                        GeoUtil.distanceInKm(lat, lon,
                                entry.getValue().getLatitude(), entry.getValue().getLongitude())
                ))
                .map(entry->entry.getKey()); // return only the driver
    }
}
