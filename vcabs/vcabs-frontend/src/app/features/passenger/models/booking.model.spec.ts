import { Booking, BookingDetails, Cab, Location } from './booking.model';

describe('Booking Model', () => {
  it('should create a booking object correctly', () => {
    const pickupLocation: Location = {
      address: '123 Main Street, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      coordinates: {
        lat: 19.0760,
        lng: 72.8777
      }
    };

    const dropLocation: Location = {
      address: '456 Business District, Bandra Kurla Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      coordinates: {
        lat: 19.0542,
        lng: 72.8703
      }
    };

    const cab: Cab = {
      id: '1',
      type: '4-seater',
      name: 'Mini',
      basePrice: 40,
      pricePerKm: 12,
      image: 'mini-car.jpg',
      features: ['AC', 'Music', '4 Seats']
    };

    const bookingDetails: BookingDetails = {
      pickupLocation: pickupLocation,
      dropLocation: dropLocation,
      distance: 15,
      estimatedDuration: 45,
      cab: cab,
      tripType: 'single',
      bookingType: 'trip',
      totalAmount: 230,
      bookingDate: new Date('2024-01-15'),
      travelDate: new Date('2024-01-16'),
      travelTime: '09:00',
      passengers: 2
    };

    const booking: Booking = {
      id: 'BK001',
      customerId: 'customer-1',
      bookingDetails: bookingDetails,
      status: 'completed',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
      paymentStatus: 'paid'
    };

    expect(booking).toBeTruthy();
    expect(booking.bookingDetails.pickupLocation.city).toBe('Mumbai');
    expect(booking.status).toBe('completed');
    expect(booking.bookingDetails.cab.name).toBe('Mini');
    expect(booking.bookingDetails.totalAmount).toBe(230);
  });

  it('should create a location with coordinates', () => {
    const location: Location = {
      address: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      coordinates: {
        lat: 12.34,
        lng: 56.78
      }
    };

    expect(location.coordinates?.lat).toBe(12.34);
    expect(location.coordinates?.lng).toBe(56.78);
  });

  it('should create a cab with features', () => {
    const cab: Cab = {
      id: '2',
      type: '6-seater',
      name: 'SUV',
      basePrice: 80,
      pricePerKm: 18,
      image: 'suv-car.jpg',
      features: ['AC', 'Music', 'Spacious', '6 Seats']
    };

    expect(cab.features.length).toBe(4);
    expect(cab.type).toBe('6-seater');
    expect(cab.basePrice).toBe(80);
  });
});