package com.secBackend.cab_backend.dataTransferObject;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RideRequestDto {
    private String pickUpLocation;
    private String dropOffLocation;
    private double pickUpLatitude;
    private double pickUpLongitude;
    private double dropOffLatitude;
    private double dropOffLongitude;
    private int numberOfCustomers;
    private int distanceKm;
    private int fare;
    private int minitues;
    private String cabType;
    private String RideType; // Make sure field name matches exactly
    private LocalDateTime scheduledTime;
    private int rentalHours;

    // Add getter with null safety
    public String getRideType() {
        return RideType != null ? RideType : "LOCAL";
    }
}