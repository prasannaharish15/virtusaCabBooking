import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DriverService, DriverDetailDto } from '../../../core/services/driver';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  isSaving: boolean = false;
  isLoading: boolean = true;
  saveMessage: string = '';
  errorMessage: string = '';

  // Personal details
  personal = {
    name: '',
    phone: '',
    email: ''
  };

  // Vehicle details
  vehicle = {
    make: '',
    model: '',
    registrationNumber: '',
    color: ''
  };

  // License details
  license = {
    number: '',
    expiry: ''
  };

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    console.log('👤 Profile Component Initialized');
    this.loadProfileData();
  }

  /**
   * Load profile data from backend
   */
  loadProfileData(): void {
    console.log('📊 Loading Profile Data...');
    this.isLoading = true;
    
    this.driverService.getProfileData().subscribe({
      next: (response: {data: DriverDetailDto}) => {
        console.log('✅ Profile Data Loaded:', response);
        const data = response.data;
        
        // Populate personal details
        this.personal.name = data.userName;
        this.personal.phone = data.phoneNumber;
        this.personal.email = data.email;
        
        // Populate vehicle details
        this.vehicle.make = data.make || '';
        this.vehicle.model = data.model || '';
        this.vehicle.registrationNumber = data.vehicleNumber || '';
        this.vehicle.color = data.color || '';
        
        // Populate license details
        this.license.number = data.licenseNumber || '';
        this.license.expiry = data.licenceExpiryDate || '';
        
        this.isLoading = false;
        console.log('✅ Profile Data Populated:', {
          personal: this.personal,
          vehicle: this.vehicle,
          license: this.license
        });
      },
      error: (err) => {
        console.error('❌ Error loading profile:', err);
        console.error('❌ Error Status:', err.status);
        console.error('❌ Error Message:', err.message);
        this.isLoading = false;
        this.errorMessage = 'Failed to load profile data';
      }
    });
  }

  saveProfile(): void {
    console.log('💾 Saving Profile...');
    this.isSaving = true;
    this.saveMessage = '';
    this.errorMessage = '';
    
    // Format payload to match backend RegisterUserRequest structure
    const payload = {
      userName: this.personal.name,
      email: this.personal.email,
      phoneNumber: this.personal.phone,
      driverDetails: {
        licenseNumber: this.license.number,
        vehicleNumber: this.vehicle.registrationNumber,
        make: this.vehicle.make,
        model: this.vehicle.model,
        color: this.vehicle.color,
        licenceExpiryDate: this.license.expiry
      }
    };
    
    console.log('📤 Sending Payload:', payload);
    
    this.driverService.updateDriverProfile(payload).subscribe({
      next: (response) => {
        console.log('✅ Profile Updated Successfully:', response);
        this.isSaving = false;
        this.saveMessage = 'Profile updated successfully!';
        // Clear message after 3 seconds
        setTimeout(() => {
          this.saveMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('❌ Error updating profile:', err);
        console.error('❌ Error Status:', err.status);
        console.error('❌ Error Body:', err.error);
        this.isSaving = false;
        this.errorMessage = err.error?.error || 'Failed to update profile';
        // Clear message after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }
}
