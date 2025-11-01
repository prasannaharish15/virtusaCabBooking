package com.secBackend.cab_backend.service;

import com.secBackend.cab_backend.dataTransferObject.DriverDetailDto;
import com.secBackend.cab_backend.model.DriverProfile;
import com.secBackend.cab_backend.model.RideRequest;
import com.secBackend.cab_backend.model.RideRequest.RideStatus;
import com.secBackend.cab_backend.model.User;
import com.secBackend.cab_backend.repository.DriverProfileRepository;
import com.secBackend.cab_backend.repository.RideRequestRepository;
import com.secBackend.cab_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class DriverService {

    private final UserRepository userRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final RideRequestRepository rideRequestRepository;

    public DriverService(UserRepository userRepository,
                         DriverProfileRepository driverProfileRepository,
                         RideRequestRepository rideRequestRepository) {
        this.userRepository = userRepository;
        this.driverProfileRepository = driverProfileRepository;
        this.rideRequestRepository = rideRequestRepository;
    }

    //  Update driver availability
    public ResponseEntity<?> setDriverAvailability(String email, boolean available) {
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (driver.getDriverProfile() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "Driver Profile Not Found"));
        }

        DriverProfile profile = driver.getDriverProfile();
        profile.setAvailable(available);
        driverProfileRepository.save(profile);

        return ResponseEntity.status(HttpStatus.OK)
                .body(Map.of("Message", "Driver Availability Updated to " + available));
    }

    //  Get profile data
    public ResponseEntity<?> getProfileData(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getDriverProfile() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "Driver Profile Not Found"));
        }

        DriverProfile profile = user.getDriverProfile();
        DriverDetailDto driverDetailDto = new DriverDetailDto();
        driverDetailDto.setId(profile.getId());
        driverDetailDto.setUserId(user.getId());
        driverDetailDto.setUserName(user.getUsername());
        driverDetailDto.setEmail(user.getEmail());
        driverDetailDto.setPhoneNumber(user.getPhoneNumber());
        driverDetailDto.setLicenseNumber(profile.getLicenseNumber());
        driverDetailDto.setVehicleNumber(profile.getVehicleNumber());
        driverDetailDto.setMake(profile.getMake());
        driverDetailDto.setModel(profile.getModel());
        driverDetailDto.setColor(profile.getColor());
        driverDetailDto.setLicenceExpiryDate(String.valueOf(profile.getLicenceExpiryDate()));

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", driverDetailDto));
    }

    //  Start Ride
    public ResponseEntity<?> startRide(Long driverId) {
        Optional<RideRequest> rideOpt = rideRequestRepository.findByDriver_IdAndStatus(driverId, RideStatus.ACCEPTED);

        if (rideOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No active ride found for driver " + driverId);
        }

        RideRequest ride = rideOpt.get();
        ride.setStatus(RideStatus.IN_PROGRESS);
        ride.setStartedAt(LocalDateTime.now());
        rideRequestRepository.save(ride);

        return ResponseEntity.ok("Ride started successfully!");
    }

    //  End Ride
    public ResponseEntity<?> endRide(Long driverId) {
        Optional<RideRequest> rideOpt = rideRequestRepository.findByDriver_IdAndStatus(driverId, RideStatus.IN_PROGRESS);

        if (rideOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No ongoing ride found for driver " + driverId);
        }

        RideRequest ride = rideOpt.get();
        ride.setStatus(RideStatus.COMPLETED);
        ride.setCompletedAt(LocalDateTime.now());
        rideRequestRepository.save(ride);

        return ResponseEntity.ok("Ride completed successfully!");
    }
}
