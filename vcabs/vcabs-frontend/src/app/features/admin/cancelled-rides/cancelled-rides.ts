import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface CancelledRideRow {
  customerId: string;
  customerName: string;
  driverId: string;
  pickupLocation: string;
  dropLocation: string;
  cancellationReason: string;
  refundAmount: number;
}

@Component({
  selector: 'app-cancelled-rides',
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, RouterModule, HttpClientModule],
  templateUrl: './cancelled-rides.html',
  styleUrl: './cancelled-rides.css'
})
export class CancelledRides implements OnInit {
  rides: CancelledRideRow[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCancelledRides();
  }

  fetchCancelledRides() {
    this.http.get<CancelledRideRow[]>('http://localhost:8080/api/admin/rides/cancelled').subscribe({
      next: (data) => {
        this.rides = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching cancelled rides', err);
        this.error = 'Failed to load cancelled rides.';
        this.loading = false;
      }
    });
  }
}
