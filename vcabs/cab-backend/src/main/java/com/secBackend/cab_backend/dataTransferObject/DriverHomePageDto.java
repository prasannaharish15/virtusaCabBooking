package com.secBackend.cab_backend.dataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverHomePageDto {
    private String driverName;
    private Long driverId;
    private int todayRideNo;
    private int todayEarnings;
}
