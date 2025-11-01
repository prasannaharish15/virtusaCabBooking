package com.secBackend.cab_backend.dataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RideAdminViewDto {
    private Long rideId;
    private String customerName;
    private String driverName;
    private String pickUpLocation;
    private String destinationLocation;
    private double distanceKm;
    private int fare;
    private String cabType;
    private String status;
    private LocalDateTime requestedAt;
    private LocalDateTime completedAt;
}
