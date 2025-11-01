import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  imports: [CommonModule, NgFor, CurrencyPipe, RouterModule, HttpClientModule],
  templateUrl: './active-rides.html',
  styleUrl: './active-rides.css'
})
export class ActiveRides implements OnInit {
  rides: ActiveRideRow[] = [];
  apiUrl = 'http://localhost:8080/api/admin/rides?status=ACTIVE';
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchActiveRides();
  }

  fetchActiveRides(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Transform backend structure to match frontend table fields
        this.rides = data.map((ride) => ({
          customerId: `CUST-${ride.customer?.id}`,
          customerName: ride.customer?.username,
          driverId: `DRV-${ride.driver?.id}`,
          pickupLocation: ride.pickUpLocation,
          dropLocation: ride.dropOffLocation,
          amount: ride.fare
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching active rides:', err);
        this.error = 'Failed to load rides. Please try again later.';
        this.loading = false;
      }
    });
  }
}
