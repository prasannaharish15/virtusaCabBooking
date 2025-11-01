import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { Subscription, timer } from 'rxjs';

interface Booking {
  id?: string;
  rideId?: string;
  status?: string;
  pickUpLocation?: string;
  dropOffLocation?: string;
  distanceKm?: number;
  durationMinutes?: number;
  fare?: number;
  cabType?: string;
  numberOfCustomers?: number;
  rideType?: string;
  pickupLocation?: { address: string };
  dropLocation?: { address: string };
  distance?: number;
  estimatedDuration?: number;
  cab?: { name: string };
  passengers?: number;
  totalAmount?: number;
  driverName?: string;
  phoneNumber?: string;
  scheduledDateTime?: string;
}

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit, OnDestroy {
  bookingId: string = '';
  booking: Booking | null = null;
  loading: boolean = false;
  error: string = '';
  private _refreshSubscription?: Subscription;
  
  // Getter for debug panel
  get refreshSubscription() {
    return this._refreshSubscription;
  }

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.bookingId) {
      console.log('📖 Loading booking details for ID:', this.bookingId);
      this.loadBookingDetails();
    } else {
      this.error = 'No booking ID provided';
      this.loading = false;
      console.error('❌ No booking ID found in route');
    }
  }

  ngOnDestroy(): void {
    if (this._refreshSubscription) {
      this._refreshSubscription.unsubscribe();
      console.log('🔚 Auto-refresh stopped');
    }
  }

  loadBookingDetails(): void {
    this.error = '';
    this.loading = true;
    console.log('🔍 Loading booking details for ID:', this.bookingId);
    console.log('🌐 Current booking state:', this.booking);
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (this.loading) {
        console.warn('⏰ Booking details request timed out');
        this.loading = false;
        this.error = 'Request timed out. Please try again.';
      }
    }, 15000); // 15 second timeout
    
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (response: any) => {
        clearTimeout(timeoutId);
        console.log('✅ Booking details response:', response);
        console.log('📋 Response type:', typeof response);
        console.log('📋 Response keys:', Object.keys(response || {}));
        
        // Handle different response formats
        if (response && response.data) {
          this.booking = response.data;
          console.log('📊 Using response.data');
        } else if (response && (response.rideId || response.id)) {
          this.booking = response;
          console.log('📊 Using direct response');
        } else if (response) {
          this.booking = response;
          console.log('📊 Using fallback response');
        } else {
          console.error('❌ No valid response data');
          this.error = 'No booking data received from server';
        }
        
        console.log('📊 Final processed booking data:', this.booking);
        console.log('🔄 Setting loading to false...');
        this.loading = false;
        console.log('✅ Loading state is now:', this.loading);
        
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.cdr.detectChanges();
          console.log('🔄 Change detection triggered');
        }, 0);
        
        // Start auto-refresh only after initial load is complete
        if (!this._refreshSubscription && this.booking) {
          this.startAutoRefresh();
        }
      },
      error: (err: any) => {
        clearTimeout(timeoutId);
        console.error('❌ Full error object:', err);
        console.error('❌ Error status:', err.status);
        console.error('❌ Error message:', err.message);
        console.error('❌ Error body:', err.error);
        
        console.log('🔄 Setting loading to false due to error...');
        this.loading = false;
        console.log('✅ Loading state is now:', this.loading);
        
        if (err.status === 0) {
          this.error = 'Cannot connect to server. Please check if the server is running.';
        } else if (err.status === 404) {
          this.error = 'Booking not found. It may have been cancelled or does not exist.';
        } else if (err.status === 500) {
          this.error = 'Server error. Please try again in a few moments.';
        } else {
          this.error = `Failed to load booking details: ${err.message || 'Unknown error'}`;
        }
        
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.cdr.detectChanges();
          console.log('🔄 Change detection triggered for error state');
        }, 0);
      }
    });
  }

  startAutoRefresh(): void {
    // Refresh every 10 seconds for pending bookings
    this._refreshSubscription = timer(10000, 10000).subscribe(() => {
      if (this.booking && 
          this.booking.status !== 'COMPLETED' && 
          this.booking.status !== 'CANCELLED' &&
          !this.loading) {
        console.log('🔄 Auto-refreshing booking status...');
        // Use a lighter refresh that doesn't show loading overlay
        this.refreshBookingStatus();
      }
    });
  }

  private refreshBookingStatus(): void {
    // Silent refresh without showing loading overlay
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (response: any) => {
        console.log('🔄 Auto-refresh response:', response);
        
        // Handle different response formats
        if (response.data) {
          this.booking = response.data;
        } else if (response.rideId || response.id) {
          this.booking = response;
        } else {
          this.booking = response;
        }
        
        console.log('🔄 Updated booking data:', this.booking);
        
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err: Error) => {
        console.error('❌ Auto-refresh error:', err);
        // Don't show error for auto-refresh failures
        // Keep existing booking data visible
      }
    });
  }

  cancelBooking(): void {
    if (this.bookingId && this.booking) {
      if (confirm('Are you sure you want to cancel this booking?')) {
        this.loading = true;
        this.bookingService.cancelBooking(this.bookingId).subscribe({
          next: () => {
            if (this.booking) {
              this.booking.status = 'CANCELLED';
            }
            this.loading = false;
            alert('✅ Booking cancelled successfully');
            console.log('✅ Booking cancelled:', this.bookingId);
          },
          error: (err: Error) => {
            this.loading = false;
            alert('❌ Failed to cancel booking: ' + err.message);
            console.error('❌ Error cancelling booking:', err);
          }
        });
      }
    }
  }

  // Helper method to format status for display
  getStatusDisplay(status: string | undefined): string {
    if (!status) return 'Unknown';
    
    const statusMap: {[key: string]: string} = {
      'REQUESTED': 'Requested',
      'ACCEPTED': 'Confirmed',
      'IN_PROGRESS': 'In Progress', 
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled',
      'PENDING': 'Pending',
      'CONFIRMED': 'Confirmed'
    };
    
    return statusMap[status] || status;
  }

  // Helper method to get status color
  getStatusColor(status: string | undefined): string {
    if (!status) return 'gray';
    
    const colorMap: {[key: string]: string} = {
      'REQUESTED': 'yellow',
      'PENDING': 'yellow',
      'ACCEPTED': 'green',
      'CONFIRMED': 'green',
      'IN_PROGRESS': 'blue',
      'COMPLETED': 'gray',
      'CANCELLED': 'red'
    };
    
    return colorMap[status] || 'gray';
  }
}