import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface CancelledRideRow {
  customerId: string;
  customerName: string;
  driverId: string;
  pickupLocation: string;
  dropLocation: string;
  cancellationReason: string;
  refundAmount: string;
}

@Component({
  selector: 'app-cancelled-rides',
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule],
  templateUrl: './cancelled-rides.html',
  styleUrl: './cancelled-rides.css'
})
export class CancelledRides implements OnInit {
  rides: CancelledRideRow[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchCancelledRides();
  }

  fetchCancelledRides() {
    this.http.get<any>('http://localhost:8080/api/admin/rides/cancelled').subscribe({
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
            cancellationReason: ride.reason || 'N/A',
            refundAmount: ride.refund || 'Pending'
          }));
        } else {
          // Backend returned a message object (no rides found)
          this.rides = [];
          console.log('No cancelled rides:', data.message);
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching cancelled rides', err);
        this.error = 'Failed to load cancelled rides.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
