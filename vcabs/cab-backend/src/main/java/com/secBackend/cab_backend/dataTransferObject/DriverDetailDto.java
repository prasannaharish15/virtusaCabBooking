package com.secBackend.cab_backend.dataTransferObject;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DriverDetailDto {
    private Long id;
    private Long userId;
    private String userName;
    private String email;
    private String phoneNumber;
    private String licenseNumber;
    private String vehicleNumber;
    private String make;
    private String model;
    private String color;
    private String licenceExpiryDate;

    // Constructor for AdminService - returns only basic driver info
    public DriverDetailDto(Long id, Long userId, String userName, String email, String phoneNumber, String licenseNumber, String vehicleNumber) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.licenseNumber = licenseNumber;
        this.vehicleNumber = vehicleNumber;
    }
}
