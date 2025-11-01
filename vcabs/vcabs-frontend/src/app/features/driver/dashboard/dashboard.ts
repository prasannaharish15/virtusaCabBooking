import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AvailabilityToggleComponent } from '../availability-status/availability-toggle/availability-toggle';
import { BreakModeComponent } from '../availability-status/break-mode/break-mode';
import { StatusSummaryComponent } from '../availability-status/status-summary/status-summary';
import { DriverRequestsStore, DriverRideRequest } from '../shared/driver-requests.store';
import { DriverRidesStore, DriverStats, EarningItem } from '../shared/driver-rides.store';
import { Observable } from 'rxjs';
import { SeedService } from '../../../core/services/seed';


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
export class Dashboard implements OnInit{

  @ViewChild(StatusSummaryComponent) statusLogger!: StatusSummaryComponent;

  driverName = 'Ramesh Kumar';
  driverId = 'DRV123823';

  isOnline = true;
  isOnBreak = false;
  breakReason = '';

  currentStatus: 'Online' | 'Offline' | 'Break' = 'Online';
  currentTimestamp: Date = new Date();
  statusLogs: StatusLog[] = [
    { status: 'Online', timestamp: new Date(Date.now() - 8300000) }
  ];

  stats = {
    today: {
      rides: 4,
      earnings: 760,
      rating: 4.95,
      time: '3.2'
    }
  };

  earnings = {
    today: 760,
    week: 3520,
    month: 14670
  };

  // Live streams (typed for template async pipe)
  live$!: Observable<DriverStats>;
  earnings$!: Observable<EarningItem[]>;

  recentFeedback = [
    { rider: 'Amrita Singh', rating: 5, comment: 'Excellent trip!', date: new Date(Date.now() - 1200000) },
    { rider: 'Jayant R', rating: 5, comment: 'Quick and safe!', date: new Date(Date.now() - 5500000) },
    { rider: 'Varsha B', rating: 4, comment: 'Polite driver', date: new Date(Date.now() - 87000000) },
  ];

  notifications = [
    { message: 'System maintenance at 2am tonight.' }
  ];
  incomingRideRequest: RideRequest | null = null;
  mockRideRequests: RideRequest[] = [
    { id: 'REQ101', passengerName: 'Anita Sharma', pickupLocation: 'Brigade Road', dropLocation: 'Indiranagar', fare: 220, distance: 8, requestedAt: new Date(Date.now() - 2 * 60 * 1000) },
    { id: 'REQ102', passengerName: 'Vikram S', pickupLocation: 'Koramangala', dropLocation: 'HSR Layout', fare: 180, distance: 5, requestedAt: new Date(Date.now() - 7 * 60 * 1000) },
    { id: 'REQ103', passengerName: 'Neha Verma', pickupLocation: 'Whitefield', dropLocation: 'Marathahalli', fare: 320, distance: 12, requestedAt: new Date(Date.now() - 15 * 60 * 1000) }
  ];

  constructor(private requestsStore: DriverRequestsStore, private ridesStore: DriverRidesStore, private router: Router, private seed: SeedService) {
    this.live$ = this.ridesStore.observeStats();
    this.earnings$ = this.ridesStore.observeEarnings();
  }

  ngOnInit(): void {
    // Initialize from seed JSON into localStorage-backed store state (one source of truth)
    this.seed.initIfEmpty().then(() => {
      // If after seeding, requests store is still empty, fall back to mock seed for preview
      if (this.requestsStore.getSnapshot().length === 0) {
        const seed: DriverRideRequest[] = this.mockRideRequests.map(r => ({ ...r }));
        this.requestsStore.set(seed);
      }
    });
    // For demo purposes, simulate an incoming request shortly after load
    this.simulateIncomingRequest();
  }

  simulateIncomingRequest() {
    // Simulate a ride request arriving after 5 seconds
    setTimeout(() => {
      this.incomingRideRequest = {
        id: 'REQ123',
        passengerName: 'Rajesh Kumar',
        pickupLocation: 'MG Road',
        dropLocation: 'Airport',
        fare: 350,
        distance: 12,
        requestedAt: new Date()
      };
    }, 5000);
  }
  acceptRequest() {
    if (!this.incomingRideRequest) return;
    const r = this.incomingRideRequest;
    this.changeStatus('Online', `Accepted ride from ${r.passengerName}`);
    // Add to ongoing with fixed fare
    this.ridesStore.acceptRide({
      id: r.id,
      passengerName: r.passengerName,
      pickupLocation: r.pickupLocation,
      dropLocation: r.dropLocation,
      fare: r.fare
    });
    this.incomingRideRequest = null;
    this.router.navigate(['/driver/ride-tracking', r.id]);
  }

  rejectRequest() {
    if (this.incomingRideRequest) {
      console.log('Rejected:', this.incomingRideRequest);
      this.incomingRideRequest = null;
    }
  }

  acceptMockPreview(request: RideRequest) {
    // Immediately accept into rides store and navigate to tracking
    this.changeStatus('Online', `Preview accept for ${request.passengerName}`);
    this.ridesStore.acceptRide({
      id: request.id,
      passengerName: request.passengerName,
      pickupLocation: request.pickupLocation,
      dropLocation: request.dropLocation,
      fare: request.fare
    });
    // Keep preview list cleanup, too
    this.removeFromPreview(request.id);
    this.router.navigate(['/driver/ride-tracking', request.id]);
  }

  removeFromPreview(id: string) {
    this.mockRideRequests = this.mockRideRequests.filter(r => r.id !== id);
    this.requestsStore.remove(id);
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
    this.changeStatus(isOnline ? 'Online' : 'Offline');
  }

  onBreakModeChange(event: { isOnBreak: boolean, breakReason: string }) {
    this.changeStatus(event.isOnBreak ? 'Break' : 'Online', event.isOnBreak ? 'Started break' : 'Ended break', event.breakReason);
  }
}