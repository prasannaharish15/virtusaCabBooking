import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../../../core/services/driver';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  isSaving: boolean = false;
  saveMessage: string = '';

  // Personal details
  personal = {
    name: 'Ramesh Kumar',
    phone: '9876543210',
    email: 'ramesh@example.com'
  };

  // Vehicle details
  vehicle = {
    make: 'Maruti',
    model: 'Dzire',
    registrationNumber: 'KA 01 AB 1234',
    color: 'White'
  };

  // License details
  license = {
    number: 'DL-0420190123456',
    expiry: '2027-12-31'
  };

  constructor(private driverService: DriverService) {}

  saveProfile(): void {
    this.isSaving = true;
    this.saveMessage = '';
    const payload = {
      personal: this.personal,
      vehicle: this.vehicle,
      license: this.license
    };
    this.driverService.updateProfile(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveMessage = 'Profile updated successfully';
      },
      error: () => {
        this.isSaving = false;
        this.saveMessage = 'Failed to update profile';
      }
    });
  }
}
