package com.secBackend.cab_backend.repository;

import com.secBackend.cab_backend.enumerations.RideType;
import com.secBackend.cab_backend.model.RideRequest;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RideRequestRepository extends JpaRepository<RideRequest, Long> {

    // Lock the row for update to prevent concurrent modifications
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM RideRequest r WHERE r.id = :rideId")
    Optional<RideRequest> findByIdForUpdate(@Param("rideId") Long rideId);

    // Find all rides by status
    List<RideRequest> findAllByStatus(RideRequest.RideStatus status);

    // Find all rides for a specific customer
    List<RideRequest> findAllByUser_Id(Long customerId);

    // Find all rides for a specific driver
    List<RideRequest> findAllByDriver_Id(Long driverId);

    RideRequest findByDriver_IdAndStatus(Long driverId, RideRequest.RideStatus status);

    Optional<RideRequest> findById(Long id);


    List<RideRequest> findAllByRideTypeAndStatusAndScheduledTimeAfter(RideType rideType, RideRequest.RideStatus rideStatus, LocalDateTime now);
}
