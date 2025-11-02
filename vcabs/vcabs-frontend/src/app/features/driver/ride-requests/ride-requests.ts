import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DriverService, RideResponseDto } from '../../../core/services/driver';

@Component({
  selector: 'app-ride-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ride-requests.html',
  styleUrls: ['./ride-requests.css'],
})
export class RideRequests implements OnInit {
  acceptedRide: RideResponseDto | null = null;
  isLoading: boolean = false;
  
  constructor(
    private driverService: DriverService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🚗 Ride Requests Component Initialized');
    this.loadAcceptedRides();
    
    // Poll for new rides every 5 seconds for real-time updates
    setInterval(() => {
      console.log('🔄 Polling for accepted rides in ride-requests page...');
      this.loadAcceptedRides();
    }, 5000);
    
    // Fallback: If still loading after 10 seconds, stop loading
    setTimeout(() => {
      if (this.isLoading) {
        console.warn('⏱️ Loading timeout - stopping loader');
        this.isLoading = false;
      }
    }, 10000);
  }

  /**
   * Load accepted rides from backend
   */
  loadAcceptedRides(): void {
    // Only show loading on first load
    if (!this.acceptedRide) {
      this.isLoading = true;
    }
    console.log('🔄 [RIDE-REQUESTS] Loading accepted rides...');
    console.log('🔄 [RIDE-REQUESTS] Current isLoading:', this.isLoading);
    console.log('🔄 [RIDE-REQUESTS] Current acceptedRide:', this.acceptedRide);
    
    this.driverService.getAcceptedRides().subscribe({
      next: (response) => {
        console.log('✅ [RIDE-REQUESTS] Accepted rides response:', response);
        console.log('✅ [RIDE-REQUESTS] Response has ride?', !!response.ride);
        
        if (response && response.ride) {
          this.acceptedRide = response.ride;
          console.log('✅ [RIDE-REQUESTS] Ride found:', this.acceptedRide);
          console.log('✅ [RIDE-REQUESTS] Ride ID:', this.acceptedRide.rideId);
          console.log('✅ [RIDE-REQUESTS] Customer:', this.acceptedRide.customerName);
        } else {
          console.log('ℹ️ [RIDE-REQUESTS] No ride in response');
          // Only clear if response explicitly has no ride
          if (!response || !response.ride) {
            this.acceptedRide = null;
          }
        }
        this.isLoading = false;
        console.log('✅ [RIDE-REQUESTS] isLoading set to false');
        console.log('✅ [RIDE-REQUESTS] acceptedRide is null?', this.acceptedRide === null);
        
        // Trigger change detection
        this.cdr.detectChanges();
        console.log('✅ [RIDE-REQUESTS] Change detection triggered');
      },
      error: (err) => {
        console.log('⚠️ [RIDE-REQUESTS] Error or no accepted rides');
        console.log('⚠️ [RIDE-REQUESTS] Status:', err.status);
        console.log('⚠️ [RIDE-REQUESTS] Message:', err.message);
        
        // Don't clear on 404 if we already have a ride
        if (err.status === 404) {
          console.log('ℹ️ [RIDE-REQUESTS] 404 - No rides available');
          if (!this.acceptedRide) {
            this.acceptedRide = null;
          }
        } else {
          console.error('❌ [RIDE-REQUESTS] Unexpected error:', err);
          this.acceptedRide = null;
        }
        
        this.isLoading = false;
        console.log('✅ [RIDE-REQUESTS] isLoading set to false after error');
        
        // Trigger change detection
        this.cdr.detectChanges();
        console.log('✅ [RIDE-REQUESTS] Change detection triggered after error');
      }
    });
  }

  /**
   * Navigate to ride tracking (ride is already accepted by backend)
   */
  acceptRequest(): void {
    if (!this.acceptedRide) return;
    this.router.navigate(['/driver/ride-tracking', this.acceptedRide.rideId]);
  }

  /**
   * Reject/Cancel the accepted ride
   */
  rejectRequest(): void {
    if (!this.acceptedRide) return;
    
    if (!confirm('Are you sure you want to reject this ride?')) {
      return;
    }

    this.driverService.cancelRide(this.acceptedRide.rideId).subscribe({
      next: () => {
        alert('Ride rejected successfully');
        this.acceptedRide = null;
        this.loadAcceptedRides();
      },
      error: (err) => {
        console.error('Error rejecting ride:', err);
        alert('Failed to reject ride. Please try again.');
      }
    });
  }
}
