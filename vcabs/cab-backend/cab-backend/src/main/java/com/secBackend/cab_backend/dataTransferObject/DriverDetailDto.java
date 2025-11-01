package com.secBackend.cab_backend.dataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverDetailDto {
    private Long id;
    private Long userId;
    private String userName;
    private String email;
    private String phoneNumber;
    private String licenseNumber;
    private String vehicleNumber;
}
