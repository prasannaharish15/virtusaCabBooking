package com.secBackend.cab_backend.dataTransferObject;

import lombok.Data;

@Data
public class RideResponseDto {
    private Long rideId;
    private Double distance;
    private int durationMinutes;
    private int fare;
    private String status;
}
