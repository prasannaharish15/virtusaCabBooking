package com.secBackend.cab_backend.dataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActiveRideAdminDto {
    private Long customerId;
    private String customerName;
    private Long driverId;
    private String driverName;
    private String pickupLocation;
    private String dropLocation;
    private int amount;
}

