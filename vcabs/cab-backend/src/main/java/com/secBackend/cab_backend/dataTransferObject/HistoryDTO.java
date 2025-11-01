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


    public HistoryDTO(Long id, Long id1, String username, String phoneNumber, String pickUpLocation, String destinationLocation, LocalDateTime acceptedAt, LocalDateTime startedAt, LocalDateTime completedAt, double distanceKm, double durationMinutes, int fare, String name) {
    }
}
