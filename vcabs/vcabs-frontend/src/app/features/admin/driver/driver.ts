import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface DriverRow {
  id: number;
  userId: number;
  userName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  vehicleNumber: string;
  make: string | null;
  model: string | null;
  color: string | null;
  licenceExpiryDate: string | null;
}

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule],
  templateUrl: './driver.html',
  styleUrl: './driver.css'
})
export class Driver implements OnInit {
  drivers: DriverRow[] = [];
  isLoading = true;
  errorMessage = '';
  private apiUrl = 'http://localhost:8080/api/admin/list-all-drivers';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.http.get<DriverRow[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.drivers = data;
        this.isLoading = false;
        console.log('Drivers loaded successfully:', data);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching drivers:', err);
        this.errorMessage = 'Failed to load drivers. Please try again.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
