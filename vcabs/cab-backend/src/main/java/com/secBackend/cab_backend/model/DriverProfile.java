package com.secBackend.cab_backend.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.secBackend.cab_backend.enumerations.DriverStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "driver_profiles")
//Driver Data Model
public class DriverProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;
    @Column(unique = true, nullable = false)
    private String licenseNumber;
    @Column(unique = true, nullable = false)
    private String vehicleNumber;
    @Column(nullable = false)
    private boolean available = false;
    @Enumerated(EnumType.STRING)
    private DriverStatus driverStatus=DriverStatus.OFFLINE;
    private String make;
    private String model;
    private String color;
    private Date licenceExpiryDate;




}
