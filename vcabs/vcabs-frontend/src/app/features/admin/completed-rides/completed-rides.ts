import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  imports: [CommonModule, NgFor, CurrencyPipe, RouterLink, HttpClientModule],
  templateUrl: './completed-rides.html',
  styleUrl: './completed-rides.css'
})
export class CompletedRides implements OnInit {
  rides: CompletedRideRow[] = [];
  private apiUrl = 'http://localhost:8080/api/admin/rides/completed';
  isLoading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCompletedRides();
  }

  loadCompletedRides() {
    this.http.get<CompletedRideRow[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.rides = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching completed rides:', error);
        this.errorMessage = 'Failed to load completed rides. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
