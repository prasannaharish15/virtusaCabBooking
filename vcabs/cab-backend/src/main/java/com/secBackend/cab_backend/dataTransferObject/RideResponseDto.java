package com.secBackend.cab_backend.dataTransferObject;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RideResponseDto {
    private Long rideId;

    // Driver details
    private Long driverId;
    private String driverName;
    private String driverPhoneNumber;

    // Customer details
    private Long customerId;
    private String customerName;
    private String customerPhoneNumber;

    // Ride details
    private String pickUpLocation;
    private String destinationLocation;
    private LocalDateTime scheduledDateTime;
    private Double distance;
    private int durationMinutes;
    private int fare;
    private String status;

    // Pickup and drop location coordinates
    private Double pickUpLatitude;
    private Double pickUpLongitude;
    private Double dropOffLatitude;
    private Double dropOffLongitude;

    // Driver current location (if available)
    private Double driverLatitude;
    private Double driverLongitude;
    private LocalDateTime driverLocationUpdatedAt;
}
