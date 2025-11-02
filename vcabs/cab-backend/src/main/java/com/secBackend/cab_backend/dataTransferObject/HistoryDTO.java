package com.secBackend.cab_backend.dataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoryDTO {
    private Long rideId;
    private Long id;
    private String name;
    private String phone;
    private String pickUpLocation;
    private String dropOffLocation;
    private LocalDateTime acceptAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Double distanceKm;
    private Double durationMinutes;
    private int fare;
    private String status;
    private String cabType;
    private String rideType;


    public HistoryDTO(Long rideId, Long id, String name, String phone, String pickUpLocation, String dropOffLocation, LocalDateTime acceptAt, LocalDateTime startedAt, LocalDateTime completedAt, double distanceKm, double durationMinutes, int fare, String status) {
        this.rideId = rideId;
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.pickUpLocation = pickUpLocation;
        this.dropOffLocation = dropOffLocation;
        this.acceptAt = acceptAt;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.distanceKm = distanceKm;
        this.durationMinutes = durationMinutes;
        this.fare = fare;
        this.status = status;
    }
}
