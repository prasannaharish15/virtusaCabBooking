import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Cab, BookingDetails, Location, BookingType } from '../../models/booking.model';

@Component({
  selector: 'app-rental-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rental-booking.component.html',
  styleUrls: ['./rental-booking.component.css']
})
export class RentalBookingComponent implements OnInit {
  rentalType: 'hourly' | 'daily' = 'hourly';
  pickupLocation: Location = { address: '', city: '', state: '', pincode: '' };
  dropLocation: Location = { address: '', city: '', state: '', pincode: '' };
  startDate: string = '';
  startTime: string = '';
  duration: number = 2;
  passengers: number = 1;
  specialRequests: string = '';
  
  availableCabs: Cab[] = [];
  selectedCab: Cab | null = null;
  
  showCabSelection = false;
  showConfirmation = false;
  
  today = new Date().toISOString().split('T')[0];

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.availableCabs = this.bookingService.getAvailableCabs();
    this.startDate = this.today;
    this.startTime = '09:00';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  isFormValid(): boolean {
    return !!(
      this.pickupLocation.address &&
      this.pickupLocation.city &&
      this.pickupLocation.pincode &&
      this.startDate &&
      this.startTime
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
    if (this.rentalType === 'hourly') {
      return cab.basePrice * 0.5 * this.duration;
    } else {
      return cab.basePrice * 8 * this.duration;
    }
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
      distance: 0,
      estimatedDuration: this.rentalType === 'hourly' ? this.duration * 60 : this.duration * 24 * 60,
      cab: this.selectedCab,
      tripType: 'single',
      bookingType: 'rental' as BookingType,
      totalAmount: this.calculatePrice(this.selectedCab),
      bookingDate: new Date(),
      travelDate: new Date(this.startDate),
      travelTime: this.startTime,
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


