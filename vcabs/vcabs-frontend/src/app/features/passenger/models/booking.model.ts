export interface Cab {
  id: string;
  type: '4-seater' | '6-seater' | '8-seater';
  name: string;
  basePrice: number;
  pricePerKm: number;
  image: string;
  features: string[];
}

export interface Location {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface BookingDetails {
  pickupLocation: Location;
  dropLocation: Location;
  distance: number;
  estimatedDuration: number;
  cab: Cab;
  tripType: 'single' | 'round';
  bookingType: BookingType;
  totalAmount: number;
  bookingDate: Date;
  travelDate: Date;
  travelTime: string;
  passengers: number;
  specialRequests?: string;
}

export type BookingType = 'trip' | 'intercity' | 'rental' | 'reserve';

export interface Booking {
  id: string;
  customerId: string;
  bookingDetails: BookingDetails;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  memberSince: Date;
  preferences: {
    preferredCabType: '4-seater' | '6-seater' | '8-seater';
    preferredPaymentMethod: string;
  };
}

export interface BookingStats {
  totalBookings: number;
  totalSpent: number;
  averageBookingValue: number;
  favoriteCabType: string;
  lastBookingDate: Date;
  bookingsByType: {
    trip: number;
    intercity: number;
    rental: number;
    reserve: number;
  };
}

export interface RideHistory {
  rideId: number;
  id: number;
  name: string;
  phone: string;
  pickUpLocation: string;
  dropOffLocation: string;
  acceptAt: string;
  startedAt: string | null;
  completedAt: string | null;
  distanceKm: number;
  durationMinutes: number;
  fare: number;
  status: string;
  cabType: string;
  rideType: string;
}

export interface RideResponse {
  rideId?: number;
  id?: number;
  driverId?: number;
  driverName?: string;
  phoneNumber?: string;
  pickUpLocation?: string;
  destinationLocation?: string;
  scheduledDateTime?: string;
  distance?: number;
  durationMinutes?: number;
  fare?: number;
  status?: string;
  message?: string;
  data?: any;
  
  // Pickup and drop coordinates
  pickUpLatitude?: number;
  pickUpLongitude?: number;
  dropOffLatitude?: number;
  dropOffLongitude?: number;
  
  // Driver current location
  driverLatitude?: number;
  driverLongitude?: number;
  driverLocationUpdatedAt?: string;
}

export interface DriverLocation {
  driverId: number;
  latitude: number;
  longitude: number;
  updatedAt: string;
}

export interface ActiveRideState {
  ride: RideResponse;
  isActive: boolean;
  lastUpdated: Date;
}