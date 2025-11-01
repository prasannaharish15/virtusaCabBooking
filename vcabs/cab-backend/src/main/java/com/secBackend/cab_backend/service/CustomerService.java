package com.secBackend.cab_backend.service;

import com.secBackend.cab_backend.dataTransferObject.CustomerHomePageDto;
import com.secBackend.cab_backend.dataTransferObject.DriverLocation;
import com.secBackend.cab_backend.dataTransferObject.HistoryDTO;
import com.secBackend.cab_backend.dataTransferObject.RideResponseDto;
import com.secBackend.cab_backend.model.RideRequest;
import com.secBackend.cab_backend.model.User;
import com.secBackend.cab_backend.repository.RideRequestRepository;
import com.secBackend.cab_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    private final UserRepository userRepository;
    private final RideRequestRepository rideRequestRepository;
    private final CabLocationService cabLocationService;

    public CustomerService(UserRepository userRepository, RideRequestRepository rideRequestRepository, CabLocationService cabLocationService) {
        this.userRepository = userRepository;
        this.rideRequestRepository = rideRequestRepository;
        this.cabLocationService = cabLocationService;
    }

    public ResponseEntity<?> getCustomerHomePage(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (!user.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User currentUser = user.get();

        // Initialize DTO
        CustomerHomePageDto response = new CustomerHomePageDto();
        response.setCustomerId(currentUser.getId());
        response.setUserName(currentUser.getUsername());
        response.setEmail(currentUser.getEmail());

        // Get all rides for the customer
        List<RideRequest> thisUserAllRides = rideRequestRepository.findAllByUser_Id(currentUser.getId());
        List<RideRequest> compltedRides = thisUserAllRides.stream()
                .filter(ride -> ride.getStatus().toString().equals("COMPLETED"))
                .toList();

        // Initialize counters
        int totalBookings = compltedRides.size();
        int totalSpent = 0;
        int totalTripBooking = 0;
        int totalInterCityBooking = 0;
        int totalRentalBooking = 0;
        int totalReserveBooking = 0;

        // Loop through rides to categorize and calculate
        for (RideRequest ride : thisUserAllRides) {
            // Only count completed rides for spending
            if (ride.getStatus().toString().equals("COMPLETED")) {
                if (ride.getFare() != 0) {
                    totalSpent += ride.getFare();
                }

                if (ride.getRideType() != null) {
                    switch (ride.getRideType().toString()) {
                        case "LOCAL":
                            totalTripBooking++;
                            break;
                        case "INTERCITY":
                            totalInterCityBooking++;
                            break;
                        case "RENTAL":
                            totalRentalBooking++;
                            break;
                        case "ADVANCE":
                            totalReserveBooking++;
                            break;
                    }
                }
            }
        }

        // Populate DTO
        response.setTotalBookings(totalBookings);
        response.setTotalspent(totalSpent);
        response.setTotalTripBooking(totalTripBooking);
        response.setTotalInterCityBooking(totalInterCityBooking);
        response.setTotalRentalBooking(totalRentalBooking);
        response.setTotalReserveBooking(totalReserveBooking);

        System.out.println("customerHomePage loaded......");

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", response));
    }

    public ResponseEntity<?> getCustomerRideHistory(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User currentUser = userOpt.get();

        // Get all rides for the user
        List<RideRequest> rides = rideRequestRepository.findAllByUser_Id(currentUser.getId());

        // Filter completed rides and map to DTO
        List<HistoryDTO> completedRides = rides.stream()
                .map(ride -> new HistoryDTO(
                        ride.getId(),
                        ride.getDriver() != null ? ride.getDriver().getId() : null,
                        ride.getDriver() != null ? ride.getDriver().getUsername() : "N/A",
                        ride.getDriver() != null ? ride.getDriver().getPhoneNumber() : "N/A",
                        ride.getPickUpLocation(),
                        ride.getDestinationLocation(),
                        ride.getAcceptedAt(),
                        ride.getStartedAt(),
                        ride.getCompletedAt(),
                        ride.getDistanceKm(),
                        (double) ride.getDurationMinutes(),
                        ride.getFare(),
                        ride.getStatus().toString(),
                        ride.getCabType() != null ? ride.getCabType().toString() : "N/A",
                        ride.getRideType() != null ? ride.getRideType().toString() : "N/A"
                ))
                .toList();

        return ResponseEntity.ok(Map.of("data", completedRides));
    }

    public ResponseEntity<?> getCustomerCurrentRide(String rideId) {
        try {
            Optional<RideRequest> currRide = rideRequestRepository.findById(Long.valueOf(rideId));
            if (currRide.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Ride not found"));
            }

            RideRequest ride = currRide.get();
            RideResponseDto response = new RideResponseDto();

            // Populate response DTO
            response.setRideId(ride.getId());

            if (ride.getDriver() != null) {
                response.setDriverId(ride.getDriver().getId());
                response.setDriverName(ride.getDriver().getUsername());
                response.setPhoneNumber(ride.getDriver().getPhoneNumber());
                
                // Get driver's current location
                DriverLocation driverLocation = cabLocationService.getLocation(ride.getDriver().getId());
                if (driverLocation != null) {
                    response.setDriverLatitude(driverLocation.getLatitude());
                    response.setDriverLongitude(driverLocation.getLongitude());
                    response.setDriverLocationUpdatedAt(driverLocation.getUpdatedAt());
                }
            } else {
                response.setDriverId(null);
                response.setDriverName("Driver not assigned yet");
                response.setPhoneNumber("N/A");
            }

            response.setPickUpLocation(ride.getPickUpLocation());
            response.setDestinationLocation(ride.getDestinationLocation());
            response.setScheduledDateTime(ride.getScheduledTime()); // Fixed field name
            response.setDistance(ride.getDistanceKm());
            response.setDurationMinutes(ride.getDurationMinutes());
            response.setFare(ride.getFare());
            response.setStatus(ride.getStatus().toString());
            
            // Add pickup and drop coordinates
            response.setPickUpLatitude(ride.getPickUpLatitude());
            response.setPickUpLongitude(ride.getPickUpLongitude());
            response.setDropOffLatitude(ride.getDestinationLatitude());
            response.setDropOffLongitude(ride.getDestinationLongitude());

            System.out.println("response"+response);

            return ResponseEntity.ok(Map.of("data", response));

        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid ride ID format"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error retrieving ride details"));
        }
    }

    // Additional method to get current active ride for a customer
    public ResponseEntity<?> getCustomerActiveRide(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User currentUser = userOpt.get();

        // Find active rides (REQUESTED, ACCEPTED, IN_PROGRESS)
        List<RideRequest> activeRides = rideRequestRepository.findAllByUser_Id(currentUser.getId()).stream()
                .filter(ride ->
                        ride.getStatus() == RideRequest.RideStatus.REQUESTED ||
                                ride.getStatus() == RideRequest.RideStatus.ACCEPTED ||
                                ride.getStatus() == RideRequest.RideStatus.IN_PROGRESS)
                .toList();

        if (activeRides.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No active ride found"));
        }

        // Return the most recent active ride
        RideRequest latestActiveRide = activeRides.stream()
                .max((r1, r2) -> r2.getRequestedAt().compareTo(r1.getRequestedAt()))
                .orElse(activeRides.get(0));

        RideResponseDto response = new RideResponseDto();
        response.setRideId(latestActiveRide.getId());

        if (latestActiveRide.getDriver() != null) {
            response.setDriverId(latestActiveRide.getDriver().getId());
            response.setDriverName(latestActiveRide.getDriver().getUsername());
            response.setPhoneNumber(latestActiveRide.getDriver().getPhoneNumber());
            
            // Get driver's current location
            DriverLocation driverLocation = cabLocationService.getLocation(latestActiveRide.getDriver().getId());
            if (driverLocation != null) {
                response.setDriverLatitude(driverLocation.getLatitude());
                response.setDriverLongitude(driverLocation.getLongitude());
                response.setDriverLocationUpdatedAt(driverLocation.getUpdatedAt());
            }
        } else {
            response.setDriverId(null);
            response.setDriverName("Driver not assigned yet");
            response.setPhoneNumber("N/A");
        }

        response.setPickUpLocation(latestActiveRide.getPickUpLocation());
        response.setDestinationLocation(latestActiveRide.getDestinationLocation());
        response.setScheduledDateTime(latestActiveRide.getScheduledTime());
        response.setDistance(latestActiveRide.getDistanceKm());
        response.setDurationMinutes(latestActiveRide.getDurationMinutes());
        response.setFare(latestActiveRide.getFare());
        response.setStatus(latestActiveRide.getStatus().toString());
        
        // Add pickup and drop coordinates
        response.setPickUpLatitude(latestActiveRide.getPickUpLatitude());
        response.setPickUpLongitude(latestActiveRide.getPickUpLongitude());
        response.setDropOffLatitude(latestActiveRide.getDestinationLatitude());
        response.setDropOffLongitude(latestActiveRide.getDestinationLongitude());

        return ResponseEntity.ok(Map.of("data", response));
    }
}