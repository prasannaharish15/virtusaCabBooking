package com.secBackend.cab_backend.dataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CancelledRideAdminDto {
    private Long customerId;
    private String customerName;
    private Long driverId;
    private String driverName;
    private String pickupLocation;
    private String dropLocation;
    private String reason;
    private String refund;

    // Constructor for easier mapping
    public CancelledRideAdminDto(Long customerId, String customerName, Long driverId, String driverName,
                                 String pickupLocation, String dropLocation) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.driverId = driverId;
        this.driverName = driverName;
        this.pickupLocation = pickupLocation;
        this.dropLocation = dropLocation;
        this.reason = "N/A"; // Default since field doesn't exist yet
        this.refund = "Pending"; // Default since field doesn't exist yet
    }
}

