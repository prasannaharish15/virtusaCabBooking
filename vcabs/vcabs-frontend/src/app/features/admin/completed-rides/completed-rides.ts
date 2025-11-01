import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface CompletedRideRow {
  customerId: string;
  customerName: string;
  driverId: string;
  pickupLocation: string;
  dropLocation: string;
  amount: number;
}

@Component({
  selector: 'app-completed-rides',
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, RouterLink],
  templateUrl: './completed-rides.html',
  styleUrl: './completed-rides.css'
})
export class CompletedRides implements OnInit {
  rides: CompletedRideRow[] = [];
  private apiUrl = 'http://localhost:8080/api/admin/rides/completed';
  isLoading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompletedRides();
  }

  loadCompletedRides() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Completed rides data:', data);
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
          console.log('No completed rides:', data.message);
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching completed rides:', error);
        this.errorMessage = 'Failed to load completed rides. Please try again later.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
