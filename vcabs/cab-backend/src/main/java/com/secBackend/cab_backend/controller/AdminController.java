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
}
