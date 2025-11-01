package com.secBackend.cab_backend.controller;

import com.secBackend.cab_backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("api/admin")
@RestController
public class AdminController {

    private final AdminService adminService;

    // Constructor injection
    public AdminController(AdminService adminService){
        this.adminService = adminService;
    }

    // Get all customers
    @GetMapping("/list-all-customers")
    public ResponseEntity<?> listAllCustomer(){
        return adminService.getAllCustomer();
    }

    // Get all drivers
    @GetMapping("/list-all-drivers")
    public ResponseEntity<?> listAllDriver(){
        return adminService.getAllDriver();
    }

    //  Get all active rides
    @GetMapping("/rides/active")
    public ResponseEntity<?> getActiveRides() {
        return adminService.getRidesByStatus("ACTIVE");
    }

    //  Get all completed rides
    @GetMapping("/rides/completed")
    public ResponseEntity<?> getCompletedRides() {
        return adminService.getRidesByStatus("COMPLETED");
    }

    //  Get all cancelled rides
    @GetMapping("/rides/cancelled")
    public ResponseEntity<?> getCancelledRides() {
        return adminService.getRidesByStatus("CANCELLED");
    }

}
