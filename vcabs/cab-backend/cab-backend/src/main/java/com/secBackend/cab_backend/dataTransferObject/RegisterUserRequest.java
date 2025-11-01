package com.secBackend.cab_backend.dataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    public static class DriverDetails{
        private String licenseNumber;
        private String vehicleNumber;

        public String getLicenseNumber() {
            return licenseNumber;
        }

        public String getVehicleNumber() {
            return vehicleNumber;
        }
    }

}
