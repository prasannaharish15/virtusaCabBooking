package com.secBackend.cab_backend.dataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerHomePageDto {
    private String email;
    private String userName;
    private Long customerId;
    private int totalBookings;
    private int totalspent;
    private int totalTripBooking;
    private int totalInterCityBooking;
    private int totalRentalBooking;
    private int totalReserveBooking;

}
