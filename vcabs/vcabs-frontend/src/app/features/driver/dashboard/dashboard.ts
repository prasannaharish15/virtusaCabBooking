import { Component, ViewChild, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AvailabilityToggleComponent } from '../availability-status/availability-toggle/availability-toggle';
import { BreakModeComponent } from '../availability-status/break-mode/break-mode';
import { StatusSummaryComponent } from '../availability-status/status-summary/status-summary';
import { Observable } from 'rxjs';
import { DriverService, DriverHomePageDto, RideResponseDto } from '../../../core/services/driver';


export interface StatusLog {
  status: 'Online' | 'Offline' | 'Break';
  timestamp: Date;
  note?: string;
  reason?: string;
}
interface RideRequest {
  id: string;
  passengerName: string;
  pickupLocation: string;
  dropLocation: string;
  fare: number;
  distance: number;
  requestedAt: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AvailabilityToggleComponent,
    BreakModeComponent,
    StatusSummaryComponent,
    // StatCardComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit, AfterViewChecked {

  @ViewChild(StatusSummaryComponent) statusLogger!: StatusSummaryComponent;

  driverName = '';
  driverId = 0;
  
  // Backend data
  homepageData: DriverHomePageDto | null = null;
  acceptedRide: RideResponseDto | null = null;
  isLoadingData = true;

  isOnline = true;
  isOnBreak = false;
  breakReason = '';
  showStatusHistory = false;

  currentStatus: 'Online' | 'Offline' | 'Break' = 'Online';
  currentTimestamp: Date = new Date();
  statusLogs: StatusLog[] = [
    { status: 'Online', timestamp: new Date(Date.now() - 8300000) }
  ];

  stats = {
    today: {
      rides: 0,
      earnings: 0,
      rating: 0,
      time: '0'
    }
  };


  incomingRideRequest: RideRequest | null = null;
  mockRideRequests: RideRequest[] = [];

  constructor(
    private router: Router,
    private driverService: DriverService,
    private cdr: ChangeDetectorRef
  ) {}

  private viewCheckedCount = 0;

  ngOnInit(): void {
    console.log('🚀 Dashboard Component Initialized');
    console.log('📍 Current User Token:', localStorage.getItem('authToken') ? 'EXISTS' : 'MISSING');
    console.log('📍 Current User Role:', localStorage.getItem('userRole'));
    console.log('📍 Current User Email:', localStorage.getItem('userEmail'));
    console.log('📍 Initial Stats:', this.stats);
    console.log('📍 Initial Driver Name:', this.driverName);
    
    // Load real data from backend
    this.loadDashboardData();
    this.loadAcceptedRides();
    
    // Poll for new accepted rides every 5 seconds for real-time updates
    setInterval(() => {
      console.log('🔄 Polling for accepted rides...');
      this.loadAcceptedRides();
    }, 5000);
  }

  ngAfterViewChecked(): void {
    // Only log first few times to avoid console spam
    if (this.viewCheckedCount < 5) {
      console.log(`🔍 View Checked #${this.viewCheckedCount}:`, {
        driverName: this.driverName,
        todayRides: this.stats.today.rides,
        todayEarnings: this.stats.today.earnings,
        isLoadingData: this.isLoadingData
      });
      this.viewCheckedCount++;
    }
  }

  /**
   * Load dashboard data from backend API
   */
  loadDashboardData(): void {
    console.log('📊 Loading Dashboard Data...');
    this.driverService.getDriverHomepage().subscribe({
      next: (data) => {
        console.log('✅ Dashboard Data Loaded Successfully:', data);
        this.homepageData = data;
        this.driverName = data.driverName;
        this.driverId = data.driverId;
        // Update stats with real data
        this.stats.today.rides = data.todayRideNo;
        this.stats.today.earnings = data.todayEarnings;
        this.isLoadingData = false;
        console.log('✅ Dashboard State Updated:', {
          driverName: this.driverName,
          driverId: this.driverId,
          todayRides: this.stats.today.rides,
          todayEarnings: this.stats.today.earnings
        });
        // Manually trigger change detection
        this.cdr.detectChanges();
        console.log('✅ Change Detection Triggered');
      },
      error: (err) => {
        console.error('❌ Error loading dashboard data:', err);
        console.error('❌ Error Status:', err.status);
        console.error('❌ Error Message:', err.message);
        console.error('❌ Full Error:', err);
        this.isLoadingData = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Load accepted rides from backend API
   */
  loadAcceptedRides(): void {
    console.log('🚗 Checking for Accepted Rides...');
    this.driverService.getAcceptedRides().subscribe({
      next: (response) => {
        console.log('✅ Accepted Rides Response:', response);
        console.log('✅ Response has ride?', !!response.ride);
        
        if (response && response.ride) {
          console.log('✅ Found Accepted Ride:', response.ride);
          console.log('✅ Ride Status:', response.ride.status);
          console.log('✅ Ride ID:', response.ride.rideId);
          
          this.acceptedRide = response.ride;
          
          // Show as incoming request in UI
          this.incomingRideRequest = {
            id: response.ride.rideId.toString(),
            passengerName: response.ride.customerName,
            pickupLocation: response.ride.pickUpLocation,
            dropLocation: response.ride.destinationLocation,
            fare: response.ride.fare,
            distance: response.ride.distance,
            requestedAt: new Date(response.ride.scheduledDateTime)
          };
          
          console.log('✅ Incoming Ride Request Set:', this.incomingRideRequest);
          console.log('✅ incomingRideRequest is null?', this.incomingRideRequest === null);
          console.log('✅ incomingRideRequest is undefined?', this.incomingRideRequest === undefined);
          
          // Force change detection
          this.cdr.detectChanges();
          console.log('✅ Change detection triggered for accepted ride');
        } else {
          console.log('ℹ️ No ride in response or response.ride is null');
          // Only clear if we're sure there's no ride
          if (!response || !response.ride) {
            this.acceptedRide = null;
            this.incomingRideRequest = null;
            this.cdr.detectChanges();
          }
        }
      },
      error: (err) => {
        // No accepted rides found - this is normal
        if (err.status === 404) {
          console.log('ℹ️ No accepted rides (404 - Normal)');
          // Don't clear existing ride on 404, might be a temporary issue
          // Only clear if we haven't set it yet
          if (!this.incomingRideRequest) {
            this.acceptedRide = null;
            this.incomingRideRequest = null;
          }
        } else {
          console.error('❌ Error loading accepted rides:', err);
          console.error('❌ Error Status:', err.status);
          console.error('❌ Error Message:', err.message);
          console.error('❌ Full Error:', err);
        }
        this.cdr.detectChanges();
      }
    });
  }

  acceptRequest() {
    if (!this.incomingRideRequest) return;
    const r = this.incomingRideRequest;
    this.changeStatus('Online', `Accepted ride from ${r.passengerName}`);
    
    // Navigate to ride tracking (backend already marked as accepted)
    this.incomingRideRequest = null;
    this.router.navigate(['/driver/ride-tracking', r.id]);
  }

  rejectRequest() {
    if (!this.incomingRideRequest) {
      console.warn('⚠️ No incoming ride request to reject');
      return;
    }
    
    const rideId = parseInt(this.incomingRideRequest.id);
    console.log('❌ Rejecting Ride:', rideId);
    
    // Call backend to cancel the ride
    this.driverService.cancelRide(rideId).subscribe({
      next: (response) => {
        console.log('✅ Ride Rejected Successfully:', response);
        this.incomingRideRequest = null;
        this.acceptedRide = null;
        // Reload accepted rides
        this.loadAcceptedRides();
      },
      error: (err) => {
        console.error('❌ Error rejecting ride:', err);
        console.error('❌ Error Status:', err.status);
        console.error('❌ Error Message:', err.message);
        alert('Failed to reject ride. Please try again.');
      }
    });
  }



  changeStatus(newStatus: 'Online' | 'Offline' | 'Break', note?: string, reason?: string) {
    this.currentStatus = newStatus;
    this.currentTimestamp = new Date();
    this.isOnline = newStatus === 'Online';
    this.isOnBreak = newStatus === 'Break';
    this.breakReason = reason || '';
    this.statusLogs.unshift({
      status: newStatus,
      timestamp: this.currentTimestamp,
      note,
      reason
    });
    if (this.statusLogs.length > 50) this.statusLogs.pop();
    if (this.statusLogger) {
      this.statusLogger.addNewLog({
        status: newStatus, timestamp: this.currentTimestamp, note, reason
      });
    }
  }

  onAvailabilityChange(isOnline: boolean) {
    // Check if driver has active ride
    if (this.hasActiveRide()) {
      alert('Cannot change availability while you have an active ride!');
      // Revert the toggle
      this.isOnline = !isOnline;
      return;
    }

    console.log('🔄 Updating Availability Status:', isOnline ? 'ONLINE' : 'OFFLINE');
    // Update backend availability status
    this.driverService.updateAvailability(isOnline).subscribe({
      next: (response) => {
        console.log('✅ Availability Updated Successfully:', response);
        console.log('✅ New Status:', isOnline ? 'ONLINE' : 'OFFLINE');
        this.changeStatus(isOnline ? 'Online' : 'Offline');
      },
      error: (err) => {
        console.error('❌ Error updating availability:', err);
        console.error('❌ Error Status:', err.status);
        console.error('❌ Error Message:', err.message);
        // Revert the toggle on error
        this.isOnline = !isOnline;
        alert('Failed to update availability. Please try again.');
      }
    });
  }

  onBreakModeChange(event: { isOnBreak: boolean, breakReason: string }) {
    // Check if driver has active ride
    if (this.hasActiveRide()) {
      alert('Cannot take a break while you have an active ride!');
      // Revert the break mode
      this.isOnBreak = !event.isOnBreak;
      return;
    }

    console.log('🔄 Updating Break Mode:', event.isOnBreak ? 'ON BREAK' : 'ENDING BREAK');
    
    // When going on break, set availability to false (offline)
    // When ending break, set availability to true (online)
    const newAvailability = !event.isOnBreak;
    
    this.driverService.updateAvailability(newAvailability).subscribe({
      next: (response) => {
        console.log('✅ Break Mode Updated Successfully:', response);
        this.changeStatus(event.isOnBreak ? 'Break' : 'Online', event.isOnBreak ? 'Started break' : 'Ended break', event.breakReason);
      },
      error: (err) => {
        console.error('❌ Error updating break mode:', err);
        // Revert the break mode on error
        this.isOnBreak = !event.isOnBreak;
        alert('Failed to update break mode. Please try again.');
      }
    });
  }

  /**
   * Check if driver has an active ride (ACCEPTED or IN_PROGRESS)
   */
  hasActiveRide(): boolean {
    return this.acceptedRide !== null && 
           (this.acceptedRide.status === 'ACCEPTED' || this.acceptedRide.status === 'IN_PROGRESS');
  }
}