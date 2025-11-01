import { Component, OnInit } from '@angular/core';
import { RideRequest } from '../../../core/services/driver';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverRequestsStore } from '../shared/driver-requests.store';
import { DriverRidesStore } from '../shared/driver-rides.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ride-requests',
  standalone: true,  // Set true if standalone component preferred
  imports: [CommonModule, FormsModule, NgIf, NgFor, DatePipe],
  templateUrl: './ride-requests.html',
  styleUrls: ['./ride-requests.css'],
})
export class RideRequests implements OnInit {
  rideRequests: RideRequest[] = [];
  isLoading: boolean = false;
  selectedRequest: RideRequest | null = null;
  otp: string = '';
  showOtpBox: boolean = false;
  acceptMessage: string = '';
  // Fallback mock data
  fallbackRequests: RideRequest[] = [
    { id: 'REQ201', passengerName: 'Karthik', pickupLocation: 'BTM Layout', dropLocation: 'Bellandur', status: 'NEW', requestedAt: new Date().toISOString() },
    { id: 'REQ202', passengerName: 'Pooja', pickupLocation: 'HSR', dropLocation: 'Koramangala', status: 'NEW', requestedAt: new Date(Date.now() - 5*60*1000).toISOString() },
    { id: 'REQ203', passengerName: 'Sanjay', pickupLocation: 'MG Road', dropLocation: 'HAL', status: 'NEW', requestedAt: new Date(Date.now() - 12*60*1000).toISOString() },
  ];
  
  constructor(
    private requestsStore: DriverRequestsStore,
    private ridesStore: DriverRidesStore,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // use shared store as the single source of truth
    this.requestsStore.observe().subscribe(shared => {
      this.rideRequests = shared.map(s => ({
        id: s.id,
        passengerName: s.passengerName,
        pickupLocation: s.pickupLocation,
        dropLocation: s.dropLocation,
        status: 'NEW',
        requestedAt: typeof s.requestedAt === 'string' ? s.requestedAt : s.requestedAt.toISOString(),
      } as RideRequest));
    });
  }

  // removed backend fetch; store drives the UI

  acceptRequest(request: RideRequest): void {
    this.selectedRequest = request;
    this.acceptMessage = '';
    const fare = (request as any).fare ?? 200; // fallback fixed fare if not provided

    // Add to ongoing with fixed fare, but not started yet (OTP on tracking)
    this.ridesStore.acceptRide({
      id: request.id,
      passengerName: request.passengerName,
      pickupLocation: request.pickupLocation,
      dropLocation: request.dropLocation,
      fare
    });
    // Remove from lists and go to tracking
    this.requestsStore.remove(request.id);
    this.rideRequests = this.rideRequests.filter(r => r.id !== request.id);
    this.router.navigate(['/driver/ride-tracking', request.id]);
  }

  rejectRequest(rideId: string): void {
    const originalRequests = [...this.rideRequests];
    this.rideRequests = this.rideRequests.filter(r => r.id !== rideId);

    this.requestsStore.remove(rideId);
    alert('Ride rejected');
  }

  // OTP flow moved to Ride Tracking page
  confirmOtp(): void { return; }
}
