import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface ActiveRideRow {
  customerId: string;
  customerName: string;
  driverId: string;
  pickupLocation: string;
  dropLocation: string;
  amount: number;
}

@Component({
  selector: 'app-active-rides',
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, RouterModule],
  templateUrl: './active-rides.html',
  styleUrl: './active-rides.css'
})
export class ActiveRides implements OnInit {
  rides: ActiveRideRow[] = [];
  apiUrl = 'http://localhost:8080/api/admin/rides/active';
  loading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchActiveRides();
  }

  fetchActiveRides(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        // Check if data is an array (has rides) or an object (no rides message)
        if (Array.isArray(data)) {
          // Backend returns flat DTO structure
          this.rides = data.map((ride) => ({
            customerId: `CUST-${ride.customerId}`,
            customerName: ride.customerName,
            driverId: `DRV-${ride.driverId}`,
            pickupLocation: ride.pickupLocation,
            dropLocation: ride.dropLocation,
            amount: ride.amount
          }));
        } else {
          // Backend returned a message object (no rides found)
          this.rides = [];
          console.log('No active rides:', data.message);
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching active rides:', err);
        this.error = 'Failed to load rides. Please try again later.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
