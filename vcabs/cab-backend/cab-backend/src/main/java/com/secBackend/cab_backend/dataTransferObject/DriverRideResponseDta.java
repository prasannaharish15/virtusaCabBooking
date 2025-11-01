package com.secBackend.cab_backend.dataTransferObject;

import com.secBackend.cab_backend.model.RideRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverRideResponseDta {
    private Long id;
    private String pickUpLocation;
    private String destinationLocation;
    private double pickUpLatitude;
    private double pickUpLongitude;
    private double destinationLatitude;
    private double destinationLongitude;
    private int fare;
    private double distanceKm;
    private int durationMinutes;
    private RideRequest.RideStatus status;

}
