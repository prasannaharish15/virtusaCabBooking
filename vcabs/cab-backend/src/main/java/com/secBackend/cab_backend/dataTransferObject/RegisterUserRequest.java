package com.secBackend.cab_backend.dataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
//DTO For RegisterUserRequest
public class RegisterUserRequest {
    private String userName;
    private String email;
    private String phoneNumber;
    private String password;
    private String role;
    private DriverDetails driverDetails;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DriverDetails{
        private String licenseNumber;
        private String vehicleNumber;
        private String make;
        private String model;
        private String color;
        private Date licenceExpiryDate;

    }

}
