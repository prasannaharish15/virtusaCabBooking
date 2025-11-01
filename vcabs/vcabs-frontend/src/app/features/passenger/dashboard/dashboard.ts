import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { BookingService } from '../services/booking.service';
import { CustomerService } from '../services/customer.service';
import { Booking, BookingStats, Customer, RideHistory } from '../models/booking.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  customer: Customer;
  stats: BookingStats = {
    totalBookings: 0,
    totalSpent: 0,
    averageBookingValue: 0,
    favoriteCabType: '4-seater',
    lastBookingDate: new Date(),
    bookingsByType: {
      trip: 0,
      intercity: 0,
      rental: 0,
      reserve: 0
    }
  };
  recentBookings: RideHistory[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private bookingService: BookingService,
    private customerService: CustomerService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.customer = this.customerService.getCurrentCustomer();
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadRecentBookings();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
    
    const headers = this.getAuthHeaders();
    
    this.http.get<any>('http://localhost:8080/api/customer/homepage', { headers })
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Request timeout or error:', error);
          this.isLoading = false;
          this.errorMessage = 'Failed to load dashboard data. Please try again.';
          this.cdr.detectChanges();
          const fallbackData = this.getFallbackData();
          this.processDashboardData(fallbackData.data);
          return of(fallbackData);
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Full API Response:', response);
          
          if (response && response.data) {
            this.processDashboardData(response.data);
          } else {
            console.error('Unexpected response format:', response);
            this.errorMessage = 'Invalid data format received';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error in dashboard data subscription:', error);
          this.errorMessage = 'Error loading dashboard data';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  private processDashboardData(data: any): void {
    try {
      console.log('Processing dashboard data:', data);
      
      // Update customer information
      this.customer = {
        ...this.customer,
        name: data.userName || this.customer.name,
        email: data.email || this.customer.email
      };

      // Calculate average booking value
      const totalSpent = data.totalspent || 0;
      const totalBookings = data.totalBookings || 0;
      const averageBookingValue = totalBookings > 0 ? Math.round(totalSpent / totalBookings) : 0;

      // Update stats with API data
      this.stats = {
        totalBookings: totalBookings,
        totalSpent: totalSpent,
        averageBookingValue: averageBookingValue,
        favoriteCabType: this.calculateFavoriteCabType(data),
        lastBookingDate: new Date(),
        bookingsByType: {
          trip: data.totalTripBooking || 0,
          intercity: data.totalInterCityBooking || 0,
          rental: data.totalRentalBooking || 0,
          reserve: data.totalReserveBooking || 0
        }
      };

      // Update customer stats in the service
      this.customerService.updateCustomerStats(totalBookings, totalSpent);
      console.log('Dashboard data processed successfully:', this.stats);
      
    } catch (error) {
      console.error('Error processing dashboard data:', error);
      this.errorMessage = 'Error processing data';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
      console.log('Loading completed, isLoading set to:', this.isLoading);
    }
  }

  private calculateFavoriteCabType(data: any): string {
    const bookingsByType = {
      trip: data.totalTripBooking || 0,
      intercity: data.totalInterCityBooking || 0,
      rental: data.totalRentalBooking || 0,
      reserve: data.totalReserveBooking || 0
    };

    const maxBookings = Math.max(
      bookingsByType.trip,
      bookingsByType.intercity,
      bookingsByType.rental,
      bookingsByType.reserve
    );

    if (maxBookings === 0) return '4-seater';

    if (bookingsByType.trip === maxBookings) return '4-seater';
    if (bookingsByType.intercity === maxBookings) return 'SUV';
    if (bookingsByType.rental === maxBookings) return 'Sedan';
    if (bookingsByType.reserve === maxBookings) return 'Luxury';

    return '4-seater';
  }

  private getFallbackData(): any {
    return {
      data: {
        email: this.customer.email,
        userName: this.customer.name,
        customerId: 1,
        totalBookings: 0,
        totalspent: 0,
        totalTripBooking: 0,
        totalInterCityBooking: 0,
        totalRentalBooking: 0,
        totalReserveBooking: 0
      }
    };
  }

  private loadRecentBookings(): void {
    const headers = this.getAuthHeaders();
    
    this.http.get<any>('http://localhost:8080/api/customer/ridehistory', { headers })
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Error loading ride history:', error);
          this.recentBookings = [];
          this.cdr.detectChanges();
          return of({ data: [] });
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Ride history API Response:', response);
          
          if (response && response.data) {
            this.recentBookings = response.data
              .map((ride: any) => this.mapRideToBooking(ride))
              .sort((a: RideHistory, b: RideHistory) => 
                new Date(b.acceptAt).getTime() - new Date(a.acceptAt).getTime()
              )
              .slice(0, 10);
          } else {
            console.error('Unexpected ride history response format:', response);
            this.recentBookings = [];
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error in ride history subscription:', error);
          this.recentBookings = [];
          this.cdr.detectChanges();
        }
      });
  }

  private mapRideToBooking(ride: any): RideHistory {
    return {
      rideId: ride.rideId,
      id: ride.id,
      name: ride.name,
      phone: ride.phone,
      pickUpLocation: ride.pickUpLocation,
      dropOffLocation: ride.dropOffLocation,
      acceptAt: ride.acceptAt,
      startedAt: ride.startedAt,
      completedAt: ride.completedAt,
      distanceKm: ride.distanceKm,
      durationMinutes: ride.durationMinutes,
      fare: ride.fare,
      status: ride.status,
      cabType: ride.cabType,
      rideType: ride.rideType
    };
  }

  // Helper method to get booking type from ride type
  getBookingType(rideType: string): string {
    const typeMap: { [key: string]: string } = {
      'LOCAL': 'trip',
      'INTERCITY': 'intercity',
      'RENTAL': 'rental',
      'RESERVE': 'reserve'
    };
    return typeMap[rideType] || 'trip';
  }

  // Helper method to format status for display
  formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'COMPLETED': 'completed',
      'PENDING': 'pending',
      'CONFIRMED': 'confirmed',
      'CANCELLED': 'cancelled',
      'IN_PROGRESS': 'in progress'
    };
    return statusMap[status] || status.toLowerCase();
  }

  // Method to retry loading data
  retryLoadData(): void {
    this.loadDashboardData();
    this.loadRecentBookings();
  }
}