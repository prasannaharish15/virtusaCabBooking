package com.secBackend.cab_backend.repository;

import com.secBackend.cab_backend.model.DriverProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverProfileRepository extends JpaRepository<DriverProfile, Long> {

    // Find driver by license number
    Optional<DriverProfile> findByLicenseNumber(String licenseNumber);

    // Find driver by vehicle number
    Optional<DriverProfile> findByVehicleNumber(String vehicleNumber);
}
