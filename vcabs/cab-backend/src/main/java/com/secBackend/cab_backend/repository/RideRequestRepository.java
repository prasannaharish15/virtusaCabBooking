package com.secBackend.cab_backend.repository;

import com.secBackend.cab_backend.enumerations.RideType;
import com.secBackend.cab_backend.model.RideRequest;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RideRequestRepository extends JpaRepository<RideRequest, Long> {

    //  Lock the row for update (used in startRide/completeRide)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM RideRequest r WHERE r.id = :rideId")
    Optional<RideRequest> findByIdForUpdate(@Param("rideId") Long rideId);

    //  Find rides by driver and status (used for accepted ride lookup)
    Optional<RideRequest> findByDriver_IdAndStatus(Long driverId, RideRequest.RideStatus status);

    //  Fetch rides by type, status, and schedule
    List<RideRequest> findAllByRideTypeAndStatusAndScheduledTimeAfter(
            RideType rideType,
            RideRequest.RideStatus status,
            LocalDateTime time
    );

    //  Fetch rides by status with user and driver loaded
    @EntityGraph(attributePaths = {"user", "driver"})
    List<RideRequest> findAllByStatus(RideRequest.RideStatus status);

    List<RideRequest> findAllByUser_Id(Long customerId);
    List<RideRequest> findAllByDriver_Id(Long driverId);
}

