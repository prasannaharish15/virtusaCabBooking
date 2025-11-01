import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface DriverRow {
  id: number;
  userName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  vehicleNumber: string;
}

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, NgFor, RouterModule, HttpClientModule],
  templateUrl: './driver.html',
  styleUrl: './driver.css'
})
export class Driver implements OnInit {
  drivers: DriverRow[] = [];
  private apiUrl = 'http://localhost:8080/api/admin/list-all-drivers';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers() {
    this.http.get<DriverRow[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.drivers = data;
      },
      error: (err) => {
        console.error('Error fetching drivers:', err);
      }
    });
  }
}
