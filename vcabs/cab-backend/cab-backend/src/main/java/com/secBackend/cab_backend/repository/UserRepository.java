package com.secBackend.cab_backend.repository;

import com.secBackend.cab_backend.enumerations.Role;
import com.secBackend.cab_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email
    Optional<User> findByEmail(String email);

    // Find user by phone number
    Optional<User> findByPhoneNumber(String phoneNumber);

    // Find all users with a specific role
    List<User> findAllByRole(Role role);
}
