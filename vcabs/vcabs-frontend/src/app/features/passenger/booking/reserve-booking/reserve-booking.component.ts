import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Cab, BookingDetails, Location, BookingType } from '../../models/booking.model';

@Component({
  selector: 'app-reserve-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserve-booking.component.html',
  styleUrls: ['./reserve-booking.component.css']
})
export class ReserveBookingComponent implements OnInit {
  tripType: 'single' | 'round' = 'single';
  pickupLocation: Location = { address: '', city: '', state: '', pincode: '' };
  dropLocation: Location = { address: '', city: '', state: '', pincode: '' };
  travelDate: string = '';
  travelTime: string = '';
  passengers: number = 1;
  specialRequests: string = '';
  
  availableCabs: Cab[] = [];
  selectedCab: Cab | null = null;
  
  showCabSelection = false;
  showConfirmation = false;
  
  estimatedDistance = 20;
  tomorrow = '';

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.availableCabs = this.bookingService.getAvailableCabs();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    this.tomorrow = tomorrowDate.toISOString().split('T')[0];
    this.travelDate = this.tomorrow;
    this.travelTime = '09:00';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  isFormValid(): boolean {
    return !!(
      this.pickupLocation.address &&
      this.pickupLocation.city &&
      this.pickupLocation.pincode &&
      this.dropLocation.address &&
      this.dropLocation.city &&
      this.dropLocation.pincode &&
      this.travelDate &&
      this.travelTime
    );
  }

  proceedToCabSelection(): void {
    if (this.isFormValid()) {
      this.showCabSelection = true;
    }
  }

  selectCab(cab: Cab): void {
    this.selectedCab = cab;
  }

  calculatePrice(cab: Cab): number {
    if (!cab) return 0;
    return this.bookingService.calculatePrice(cab, this.estimatedDistance, this.tripType);
  }

  proceedToConfirmation(): void {
    if (this.selectedCab) {
      this.showConfirmation = true;
    }
  }

  confirmBooking(): void {
    if (!this.selectedCab) return;

    const bookingDetails: BookingDetails = {
      pickupLocation: this.pickupLocation,
      dropLocation: this.dropLocation,
      distance: this.estimatedDistance,
      estimatedDuration: 60,
      cab: this.selectedCab,
      tripType: this.tripType,
      bookingType: 'reserve' as BookingType,
      totalAmount: this.calculatePrice(this.selectedCab),
      bookingDate: new Date(),
      travelDate: new Date(this.travelDate),
      travelTime: this.travelTime,
      passengers: this.passengers,
      specialRequests: this.specialRequests
    };

    this.bookingService.createBooking(bookingDetails).subscribe(booking => {
      this.router.navigate(['/passenger/booking-details', booking.id]);
    });
  }

  cancelBooking(): void {
    this.showConfirmation = false;
    this.showCabSelection = false;
    this.selectedCab = null;
  }
}


