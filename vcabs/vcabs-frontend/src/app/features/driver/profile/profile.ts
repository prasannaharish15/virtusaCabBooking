import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private driverService: DriverService,
    private cdr: ChangeDetectorRef
  ) {}

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
        
        // Defensive check for response structure
        if (!response || !response.data) {
          console.error('❌ Invalid response structure:', response);
          this.isLoading = false;
          this.errorMessage = 'Invalid response from server';
          this.cdr.detectChanges();
          return;
        }
        
        const data = response.data;
        console.log('✅ Profile Data Object:', data);
        
        // Populate personal details with defensive checks
        this.personal.name = data.userName || '';
        this.personal.phone = data.phoneNumber || '';
        this.personal.email = data.email || '';
        
        // Populate vehicle details
        this.vehicle.make = data.make || '';
        this.vehicle.model = data.model || '';
        this.vehicle.registrationNumber = data.vehicleNumber || '';
        this.vehicle.color = data.color || '';
        
        // Populate license details
        this.license.number = data.licenseNumber || '';
        // Convert date format from '2032-10-12 05:30:00.0' to '2032-10-12' for date input
        if (data.licenceExpiryDate) {
          const dateStr = data.licenceExpiryDate;
          // Extract just the date part (YYYY-MM-DD) if it includes time
          this.license.expiry = dateStr.split(' ')[0];
        } else {
          this.license.expiry = '';
        }
        
        this.isLoading = false;
        console.log('✅ Profile Data Populated:', {
          personal: this.personal,
          vehicle: this.vehicle,
          license: this.license
        });
        console.log('✅ isLoading set to:', this.isLoading);
        // Manually trigger change detection to ensure UI updates
        this.cdr.detectChanges();
        console.log('✅ Change Detection Triggered');
      },
      error: (err) => {
        console.error('❌ Error loading profile:', err);
        console.error('❌ Error Status:', err.status);
        console.error('❌ Error Message:', err.message);
        this.isLoading = false;
        this.errorMessage = 'Failed to load profile data';
        this.cdr.detectChanges();
      }
    });
  }

  saveProfile(): void {
    console.log('💾 Saving Profile...');
    
    // Basic validation
    if (!this.personal.name || !this.personal.email || !this.personal.phone) {
      this.errorMessage = 'Please fill in all personal details';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    }
    
    if (!this.vehicle.make || !this.vehicle.model || !this.vehicle.registrationNumber || !this.vehicle.color) {
      this.errorMessage = 'Please fill in all vehicle details';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    }
    
    if (!this.license.number || !this.license.expiry) {
      this.errorMessage = 'Please fill in all license details';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    }
    
    this.isSaving = true;
    this.saveMessage = '';
    this.errorMessage = '';
    
    // Format date for backend (Spring Boot accepts ISO datetime strings)
    let formattedDate: string | null = null;
    if (this.license.expiry) {
      // Convert YYYY-MM-DD to ISO datetime format (YYYY-MM-DDTHH:mm:ss.SSSZ)
      // Use midnight UTC to avoid timezone issues
      formattedDate = `${this.license.expiry}T00:00:00.000Z`;
    }
    
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
        licenceExpiryDate: formattedDate
      }
    };
    
    console.log('📤 Sending Payload:', payload);
    console.log('📤 License Expiry (original):', this.license.expiry);
    console.log('📤 License Expiry (formatted):', formattedDate);
    
    this.driverService.updateDriverProfile(payload).subscribe({
      next: (response) => {
        console.log('✅ Profile Updated Successfully:', response);
        this.isSaving = false;
        this.saveMessage = 'Profile updated successfully!';
        // Reload profile data to show updated values
        this.loadProfileData();
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
