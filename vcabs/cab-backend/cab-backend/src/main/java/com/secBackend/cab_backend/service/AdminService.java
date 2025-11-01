package com.secBackend.cab_backend.service;

import com.secBackend.cab_backend.dataTransferObject.DriverDetailDto;
import com.secBackend.cab_backend.enumerations.Role;
import com.secBackend.cab_backend.model.DriverProfile;
import com.secBackend.cab_backend.model.User;
import com.secBackend.cab_backend.repository.DriverProfileRepository;
import com.secBackend.cab_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DriverProfileRepository driverProfileRepository;

    // Constructor injection
    public AdminService(UserRepository userRepository, DriverProfileRepository driverProfileRepository) {
        this.userRepository = userRepository;
        this.driverProfileRepository = driverProfileRepository;
    }

    // Get all customers
    public ResponseEntity<?> getAllCustomer() {
        List<User> users = userRepository.findAllByRole(Role.CUSTOMER);
        if(users.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No user found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    // Get all drivers with details
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

        return ResponseEntity.status(HttpStatus.OK).body(driverData);
    }
}
