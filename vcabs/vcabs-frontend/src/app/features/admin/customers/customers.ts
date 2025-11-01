import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Customer {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  driverProfile: any | null;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, NgFor, RouterLink],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers implements OnInit {
  customers: Customer[] = [];
  isLoading = true;
  errorMessage = '';
  private apiUrl = 'http://localhost:8080/api/admin/list-all-customers';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.http.get<Customer[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.customers = data;
        this.isLoading = false;
        console.log('Customers loaded successfully:', data);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        this.errorMessage = 'Failed to load customers. Please try again.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
