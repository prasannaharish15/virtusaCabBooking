import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Customer {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, NgFor, RouterLink, HttpClientModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers implements OnInit {
  customers: Customer[] = [];
  private apiUrl = 'http://localhost:8080/api/admin/list-all-customers';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.http.get<Customer[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
      }
    });
  }
}
