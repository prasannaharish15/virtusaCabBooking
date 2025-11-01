package com.secBackend.cab_backend.service;

import com.secBackend.cab_backend.dataTransferObject.DriverDetailDto;
import com.secBackend.cab_backend.model.DriverProfile;
import com.secBackend.cab_backend.model.User;
import com.secBackend.cab_backend.repository.DriverProfileRepository;
import com.secBackend.cab_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DriverService {

    private final UserRepository userRepository;
    private final DriverProfileRepository driverProfileRepository;

    // Constructor injection
    public DriverService(UserRepository userRepository, DriverProfileRepository driverProfileRepository) {
        this.userRepository = userRepository;
        this.driverProfileRepository = driverProfileRepository;
    }

    // Update driver availability
    public ResponseEntity<?> setDriverAvailability(String email, boolean available) {
        System.out.println("DriverService setDriverAvailability " + available);
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

    public ResponseEntity<?> getProfileData(String email) {
        User user=userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if(user.getDriverProfile() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "Driver Profile Not Found"));
        }
        DriverProfile profile=user.getDriverProfile();
        DriverDetailDto driverDetailDto=new DriverDetailDto();
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
        return  ResponseEntity.status(HttpStatus.OK)
                .body(Map.of("data", driverDetailDto));


    }
}
