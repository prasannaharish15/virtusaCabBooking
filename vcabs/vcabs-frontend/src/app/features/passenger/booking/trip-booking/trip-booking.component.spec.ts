import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripBookingComponent } from './trip-booking.component';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('TripBookingComponent', () => {
  let component: TripBookingComponent;
  let fixture: ComponentFixture<TripBookingComponent>;
  let mockBookingService: jasmine.SpyObj<BookingService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const bookingServiceSpy = jasmine.createSpyObj('BookingService', [
      'getAvailableCabs',
      'calculatePrice',
      'createBooking'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TripBookingComponent],
      providers: [
        { provide: BookingService, useValue: bookingServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TripBookingComponent);
    component = fixture.componentInstance;
    mockBookingService = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock the getAvailableCabs method
    mockBookingService.getAvailableCabs.and.returnValue([
      {
        id: '1',
        type: '4-seater',
        name: 'Mini',
        basePrice: 40,
        pricePerKm: 12,
        image: 'mini-car.jpg',
        features: ['AC', 'Music', '4 Seats']
      }
    ]);

    mockBookingService.calculatePrice.and.returnValue(200);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.tripType).toBe('single');
    expect(component.passengers).toBe(1);
    expect(component.travelDate).toBeTruthy();
    expect(component.selectedCab).toBeTruthy();
  });

  it('should select a cab', () => {
    const cab = {
      id: '2',
      type: '6-seater',
      name: 'SUV',
      basePrice: 80,
      pricePerKm: 18,
      image: 'suv-car.jpg',
      features: ['AC', 'Music', 'Spacious', '6 Seats']
    };
    
    component.selectCab(cab);
    expect(component.selectedCab).toBe(cab);
  });

  it('should calculate price correctly', () => {
    const cab = component.availableCabs[0];
    const price = component.calculatePrice(cab);
    expect(price).toBe(200);
    expect(mockBookingService.calculatePrice).toHaveBeenCalledWith(cab, component.estimatedDistance, component.tripType);
  });

  it('should proceed to confirmation when form is valid', () => {
    component.pickupLocation.address = 'Test Pickup';
    component.pickupLocation.coordinates = { lat: 12.34, lng: 56.78 };
    component.dropLocation.address = 'Test Drop';
    component.dropLocation.coordinates = { lat: 12.35, lng: 56.79 };
    component.travelDate = '2024-01-01';
    component.travelTime = '10:00';
    component.selectedCab = component.availableCabs[0];

    component.proceedToConfirmation();
    expect(component.showConfirmation).toBeTrue();
  });

  it('should not proceed to confirmation when form is invalid', () => {
    component.pickupLocation.address = '';
    component.proceedToConfirmation();
    expect(component.showConfirmation).toBeFalse();
  });
});