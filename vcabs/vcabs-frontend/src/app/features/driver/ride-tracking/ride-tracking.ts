import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverRidesStore, DriverRide, PaymentMode } from '../shared/driver-rides.store';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ride-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ride-tracking.html',
  styleUrls: ['./ride-tracking.css']
})
export class RideTracking {
  rideId = '';
  ride: DriverRide | undefined;
  otp = '';
  paymentMode: PaymentMode = 'Cash';

  constructor(
    private ridesStore: DriverRidesStore,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.paramMap.subscribe(params => {
      this.rideId = params.get('rideId') || '';
      this.syncRide();
    });
    this.ridesStore.observeOngoing().subscribe(() => this.syncRide());
  }

  private syncRide() {
    if (!this.rideId) { this.ride = undefined; return; }
    this.ride = this.ridesStore.getOngoing().find(r => r.id === this.rideId);
  }

  startRide() {
    if (!this.ride) return;
    if (!this.otp || this.otp.trim().length === 0) {
      alert('Enter OTP to start');
      return;
    }
    this.ridesStore.startRideById(this.ride.id);
    this.otp = '';
    this.syncRide();
  }

  endRide() {
    if (!this.ride) return;
    this.ridesStore.completeRide(this.ride.id, this.paymentMode);
    alert('Ride completed');
    this.router.navigate(['/driver/earnings']);
  }
}
