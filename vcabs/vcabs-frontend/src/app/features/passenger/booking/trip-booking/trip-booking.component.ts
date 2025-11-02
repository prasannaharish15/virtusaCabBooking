import { Component, OnInit, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { RideStateService } from '../../services/ride-state.service';
import { Cab, Location, RideResponse, DriverLocation } from '../../models/booking.model';
import { timeout } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';

// Leaflet imports
import * as L from 'leaflet';

@Component({
  selector: 'app-trip-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-booking.component.html',
  styleUrls: ['./trip-booking.component.css']
})
export class TripBookingComponent implements OnInit, AfterViewInit, OnDestroy {
  tripType: 'single' | 'round' = 'single';
  pickupLocation: Location = {
    address: '',
    city: '',
    state: '',
    pincode: '',
    coordinates: undefined
  };
  dropLocation: Location = {
    address: '',
    city: '',
    state: '',
    pincode: '',
    coordinates: undefined
  };
  travelDate: string = '';
  travelTime: string = '';
  passengers: number = 1;
  specialRequests: string = '';

  availableCabs: Cab[] = [];
  selectedCab: Cab | null = null;

  showCabSelection = true;
  showConfirmation = false;

  estimatedDistance = 0;
  estimatedDuration = 0;
  today = new Date().toISOString().split('T')[0];

  isBookingLoading: boolean = false;

  // Map variables
  private map: L.Map | undefined;
  private pickupMarker: L.Marker | undefined;
  private dropMarker: L.Marker | undefined;
  private driverMarker: L.Marker | undefined;
  private routeLine: L.Polyline | undefined;

  // Search state
  isSearchingPickup = false;
  isSearchingDropoff = false;
  locationError: string = '';
  isGettingLocation: boolean = false;

  // debounce timers
  private pickupDebounceTimer: any = null;
  private dropDebounceTimer: any = null;

  // Active ride state
  activeRide: RideResponse | null = null;
  hasActiveRide: boolean = false;
  isLoadingActiveRide: boolean = true;
  isCancellingRide: boolean = false;
  lastStatusUpdate: Date | null = null;
  private driverLocationSubscription: Subscription | null = null;
  private rideStatusSubscription: Subscription | null = null;

  constructor(
    private bookingService: BookingService,
    private rideStateService: RideStateService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.availableCabs = this.bookingService.getAvailableCabs();
    this.travelDate = this.today;
    this.travelTime = '09:00';
    this.selectedCab = this.availableCabs && this.availableCabs.length ? this.availableCabs[0] : null;
    
    // Check for active ride on initialization
    this.checkForActiveRide();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
    this.isBookingLoading = false;
    
    // Stop driver location polling
    if (this.driverLocationSubscription) {
      this.driverLocationSubscription.unsubscribe();
    }
    
    // Stop ride status polling
    if (this.rideStatusSubscription) {
      this.rideStatusSubscription.unsubscribe();
    }
  }

  cancelBooking(): void {
    this.showConfirmation = false;
    this.isBookingLoading = false;
    console.log('Booking confirmation cancelled by user');
  }

  private initMap(): void {
    this.map = L.map('map', { zoomControl: true, attributionControl: true }).setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map!);

    // route polyline
    this.routeLine = L.polyline([], {
      color: '#9333ea',
      weight: 4,
      opacity: 0.8
    }).addTo(this.map!);

    // map click handler
    this.map.on('click', (ev: any) => {
      const latlng: L.LatLng = ev.latlng;
      this.zone.run(() => {
        if (!this.hasCoordinates(this.pickupLocation)) {
          this.createOrMoveMarker('pickup', latlng.lat, latlng.lng);
          this.reverseGeocode(latlng, 'pickup');
        } else if (!this.hasCoordinates(this.dropLocation)) {
          this.createOrMoveMarker('drop', latlng.lat, latlng.lng);
          this.reverseGeocode(latlng, 'drop');
        } else {
          this.createOrMoveMarker('drop', latlng.lat, latlng.lng);
          this.reverseGeocode(latlng, 'drop');
        }
      });
    });
  }

  private createOrMoveMarker(type: 'pickup' | 'drop', lat: number, lng: number) {
    const pickupIcon = L.divIcon({
      className: 'pickup-marker',
      html: '<div class="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const dropIcon = L.divIcon({
      className: 'drop-marker',
      html: '<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    if (type === 'pickup') {
      if (!this.pickupMarker) {
        this.pickupMarker = L.marker([lat, lng], { icon: pickupIcon, draggable: true }).addTo(this.map!);
        this.pickupMarker.on('dragend', (e) => {
          const p = (e.target as L.Marker).getLatLng();
          this.zone.run(() => this.reverseGeocode(p, 'pickup'));
        });
      } else {
        this.pickupMarker.setLatLng([lat, lng]);
      }
      this.pickupMarker.setOpacity(1);
      this.map?.setView([lat, lng], 15);
      this.pickupLocation.coordinates = { lat, lng };
    } else {
      if (!this.dropMarker) {
        this.dropMarker = L.marker([lat, lng], { icon: dropIcon, draggable: true }).addTo(this.map!);
        this.dropMarker.on('dragend', (e) => {
          const p = (e.target as L.Marker).getLatLng();
          this.zone.run(() => this.reverseGeocode(p, 'drop'));
        });
      } else {
        this.dropMarker.setLatLng([lat, lng]);
      }
      this.dropMarker.setOpacity(1);
      this.map?.setView([lat, lng], 15);
      this.dropLocation.coordinates = { lat, lng };
    }

    if (this.hasCoordinates(this.pickupLocation) && this.hasCoordinates(this.dropLocation)) {
      this.updateRoute();
    }
  }

  useCurrentLocationForPickup(): void {
    this.isGettingLocation = true;
    this.locationError = '';

    if (!navigator.geolocation) {
      this.locationError = 'Geolocation is not supported by your browser';
      this.isGettingLocation = false;
      this.showLocationError();
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.zone.run(() => {
          this.createOrMoveMarker('pickup', lat, lng);
          this.reverseGeocode(L.latLng(lat, lng), 'pickup');
          this.isGettingLocation = false;
        });
      },
      (error) => {
        this.zone.run(() => {
          this.isGettingLocation = false;
          this.handleGeolocationError(error as GeolocationPositionError);
        });
      },
      options
    );
  }

  private handleGeolocationError(error: GeolocationPositionError): void {
    console.error('Geolocation error code:', error.code, error.message);

    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.locationError = 'Location access denied. Please enable location permissions in your browser settings or search manually.';
        break;
      case error.POSITION_UNAVAILABLE:
        this.locationError = 'Location information unavailable. Please check your connection or search manually.';
        break;
      case error.TIMEOUT:
        this.locationError = 'Location request timed out. Try again or search manually.';
        break;
      default:
        this.locationError = 'Unable to get your current location. Please search manually.';
    }
    this.showLocationError();
  }

  private showLocationError(): void {
    if (!this.locationError) return;

    const bookingPanel = document.querySelector('.booking-panel');
    if (!bookingPanel) return;

    const existing = bookingPanel.querySelector('.location-error-message');
    if (existing) existing.remove();

    const errorElement = document.createElement('div');
    errorElement.className = 'location-error-message';
    errorElement.innerHTML = `
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <div class="flex-1">
            <p class="text-yellow-800 text-sm font-medium">${this.locationError}</p>
            <button class="retry-location-btn mt-2">Try Again</button>
          </div>
        </div>
      </div>
    `;

    bookingPanel.insertBefore(errorElement, bookingPanel.firstChild);
    const btn = errorElement.querySelector('.retry-location-btn');
    if (btn) btn.addEventListener('click', () => this.useCurrentLocationForPickup());
  }

  private reverseGeocode(latlng: L.LatLng, type: 'pickup' | 'drop'): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}&addressdetails=1&zoom=18&accept-language=en`;

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`Reverse geocode failed: ${r.status}`);
        return r.json();
      })
      .then((data: any) => {
        const address = data && data.address ? data.address : {};
        const displayName = data?.display_name || '';

        const locationData: Location = {
          address: displayName || `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`,
          city: address.city || address.town || address.village || address.county || '',
          state: address.state || address.region || '',
          pincode: address.postcode || '',
          coordinates: {
            lat: latlng.lat,
            lng: latlng.lng
          }
        };

        if (type === 'pickup') {
          this.pickupLocation = locationData;
          if (this.pickupMarker) {
            this.pickupMarker.bindPopup(`<strong>Pickup</strong><br/>${locationData.address}`).openPopup();
          }
        } else {
          this.dropLocation = locationData;
          if (this.dropMarker) {
            this.dropMarker.bindPopup(`<strong>Drop</strong><br/>${locationData.address}`).openPopup();
          }
        }

        if (this.hasCoordinates(this.pickupLocation) && this.hasCoordinates(this.dropLocation)) {
          this.updateRoute();
        }
      })
      .catch(err => {
        console.error('reverseGeocode error', err);
        const fallback: Location = {
          address: `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`,
          city: '',
          state: '',
          pincode: '',
          coordinates: { lat: latlng.lat, lng: latlng.lng }
        };
        if (type === 'pickup') {
          this.pickupLocation = fallback;
        } else {
          this.dropLocation = fallback;
        }
      });
  }

  private hasCoordinates(location: Location): boolean {
    return !!(location && location.coordinates && typeof location.coordinates.lat === 'number' && typeof location.coordinates.lng === 'number');
  }

  onLocationInputChange(type: 'pickup' | 'drop', value: string): void {
    if (!value || value.length < 3) return;
    
    if (type === 'pickup') {
      this.isSearchingPickup = true;
      if (this.pickupDebounceTimer) clearTimeout(this.pickupDebounceTimer);
      this.pickupDebounceTimer = setTimeout(() => {
        this.performSearch(type, value);
      }, 400);
    } else {
      this.isSearchingDropoff = true;
      if (this.dropDebounceTimer) clearTimeout(this.dropDebounceTimer);
      this.dropDebounceTimer = setTimeout(() => {
        this.performSearch(type, value);
      }, 400);
    }
  }

  private performSearch(type: 'pickup' | 'drop', query: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&addressdetails=1&limit=6&countrycodes=in&accept-language=en`;
    
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`Search failed ${r.status}`);
        return r.json();
      })
      .then((results: any[]) => {
        if (!results || results.length === 0) {
          alert('Location not found. Please try a different term.');
          return;
        }
        const chosen = results[0];
        const lat = parseFloat(chosen.lat);
        const lon = parseFloat(chosen.lon);

        this.createOrMoveMarker(type, lat, lon);
        this.reverseGeocode(L.latLng(lat, lon), type);
        this.map?.setView([lat, lon], 15);
      })
      .catch(err => {
        console.error('searchLocation error', err);
        alert('Error searching for location. Please try again.');
      })
      .finally(() => {
        this.isSearchingPickup = false;
        this.isSearchingDropoff = false;
      });
  }

  private updateRoute(): void {
    if (!this.map || !this.routeLine) return;
    if (!this.hasCoordinates(this.pickupLocation) || !this.hasCoordinates(this.dropLocation)) return;

    const s = this.pickupLocation.coordinates!;
    const e = this.dropLocation.coordinates!;

    const url = `https://router.project-osrm.org/route/v1/driving/${s.lng},${s.lat};${e.lng},${e.lat}?overview=full&geometries=geojson`;

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`OSRM error ${r.status}`);
        return r.json();
      })
      .then((data: any) => {
        if (data && data.routes && data.routes.length) {
          const route = data.routes[0];
          this.estimatedDistance = +(route.distance / 1000).toFixed(2);
          this.estimatedDuration = Math.round(route.duration / 60);

          const coords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
          this.routeLine!.setLatLngs(coords);

          if (this.pickupMarker) this.pickupMarker.setLatLng([s.lat, s.lng]);
          if (this.dropMarker) this.dropMarker.setLatLng([e.lat, e.lng]);

          const group = L.featureGroup([this.pickupMarker!, this.dropMarker!]);
          this.map?.fitBounds(group.getBounds().pad(0.12));
        } else {
          throw new Error('No route returned');
        }
      })
      .catch(err => {
        console.warn('Route calculation failed, using straight line fallback', err);
        this.estimatedDistance = this.calculateStraightLineDistance(s.lat, s.lng, e.lat, e.lng);
        this.estimatedDuration = Math.round(this.estimatedDistance * 3);
        this.routeLine!.setLatLngs([[s.lat, s.lng], [e.lat, e.lng]]);
      });
  }

  private calculateStraightLineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return +(R * c).toFixed(2);
  }

  goBack(): void {
    this.router.navigate(['/passenger/dashboard']);
  }

  isFormValid(): boolean {
    return !!(
      this.pickupLocation.address &&
      this.hasCoordinates(this.pickupLocation) &&
      this.dropLocation.address &&
      this.hasCoordinates(this.dropLocation) &&
      this.travelDate &&
      this.travelTime &&
      this.selectedCab
    );
  }

  selectCab(cab: Cab): void {
    this.selectedCab = cab;
  }

  calculatePrice(cab: Cab): number {
    if (!cab) return 0;
    return this.bookingService.calculatePrice(cab, this.estimatedDistance, this.tripType);
  }

  proceedToConfirmation(): void {
    if (this.selectedCab && this.isFormValid()) {
      this.showConfirmation = true;
    } else {
      alert('Please fill in all required fields including pickup and drop locations');
    }
  }

  confirmBooking(): void {
    if (!this.selectedCab || !this.isFormValid()) {
      alert('Please complete all required fields before confirming');
      return;
    }

    this.isBookingLoading = true;
    console.log('Starting booking process...');

    const bookingData = {
      pickupLocation: this.pickupLocation,
      dropLocation: this.dropLocation,
      distance: this.estimatedDistance,
      estimatedDuration: this.estimatedDuration,
      cab: this.selectedCab,
      tripType: this.tripType,
      totalAmount: this.calculatePrice(this.selectedCab),
      passengers: this.passengers,
      travelDate: this.travelDate,
      travelTime: this.travelTime,
      specialRequests: this.specialRequests || ''
    };

    console.log('Creating booking with data:', bookingData);
    console.log('Auth token present:', !!localStorage.getItem('authToken'));

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (this.isBookingLoading) {
        console.warn('⏰ Booking request timed out');
        this.isBookingLoading = false;
        alert('Booking request timed out. Please try again.');
        this.showConfirmation = false;
      }
    }, 45000); // 45 second timeout

    this.bookingService.createBooking(bookingData).subscribe({
      next: (response: any) => {
        clearTimeout(timeoutId);
        console.log('Booking created successfully - Full response:', response);
        
        // More comprehensive response handling
        let rideId = null;
        
        // Try multiple ways to extract the booking ID
        if (response) {
          rideId = response.rideId || 
                   response.id || 
                   response.bookingId ||
                   response.data?.rideId || 
                   response.data?.id ||
                   response.data?.bookingId ||
                   (response.result && (response.result.rideId || response.result.id));
        }
        
        this.isBookingLoading = false;
        
        if (rideId) {
          console.log('✅ Booking created! RideId:', rideId);
          
          // Fetch full ride details and set as active ride
          this.bookingService.getBookingById(rideId.toString()).subscribe({
            next: (rideDetails: RideResponse) => {
              console.log('📋 Fetched ride details:', rideDetails);
              
              // Set as active ride
              this.activeRide = rideDetails;
              this.hasActiveRide = true;
              this.rideStateService.setActiveRide(rideDetails);
              
              // Hide confirmation, show active ride
              this.showConfirmation = false;
              
              // Ensure loading is hidden
              this.isBookingLoading = false;
              
              // Display on map and start tracking
              this.displayActiveRide(rideDetails);
              
              alert('✅ Booking confirmed successfully! Your driver has been assigned.');
            },
            error: (err) => {
              console.error('Error fetching ride details:', err);
              
              // Ensure loading is hidden
              this.isBookingLoading = false;
              
              // Fallback: create basic ride response from booking data
              const basicRide: RideResponse = {
                rideId: rideId,
                pickUpLocation: this.pickupLocation.address,
                destinationLocation: this.dropLocation.address,
                pickUpLatitude: this.pickupLocation.coordinates?.lat,
                pickUpLongitude: this.pickupLocation.coordinates?.lng,
                dropOffLatitude: this.dropLocation.coordinates?.lat,
                dropOffLongitude: this.dropLocation.coordinates?.lng,
                distance: this.estimatedDistance,
                durationMinutes: this.estimatedDuration,
                fare: this.calculatePrice(this.selectedCab!),
                status: 'REQUESTED'
              };
              
              this.activeRide = basicRide;
              this.hasActiveRide = true;
              this.rideStateService.setActiveRide(basicRide);
              this.showConfirmation = false;
              
              alert('✅ Booking confirmed! Waiting for driver assignment...');
            }
          });
        } else {
          console.warn('⚠️ No rideId in response');
          this.isBookingLoading = false;
          alert('✅ Booking submitted! Check your bookings for status.');
          this.showConfirmation = false;
        }
      },
      error: (err: Error) => {
        clearTimeout(timeoutId);
        console.error('❌ Booking create error:', err);
        this.isBookingLoading = false;
        
        let errorMessage = 'Could not create booking. Please try again.';
        
        if (err.message.includes('Network error') || err.message.includes('0')) {
          errorMessage = 'Network error. Please check your connection and ensure the server is running.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error. The booking service is currently unavailable. Please try again later.';
        } else if (err.message.includes('403') || err.message.includes('forbidden')) {
          errorMessage = 'Authentication failed. Please log in again.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else if (err.message.includes('401')) {
          errorMessage = 'Session expired. Please log in again.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else if (err.message.includes('400')) {
          errorMessage = 'Invalid data. Please check your booking details.';
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Request timeout. Please check your connection and try again.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        alert(errorMessage);
        this.showConfirmation = false;
      },
      complete: () => {
        clearTimeout(timeoutId);
        console.log('Booking observable completed');
        // Ensure loading state is always reset
        if (this.isBookingLoading) {
          this.isBookingLoading = false;
        }
      }
    });
  }

  retryLocationDetection(): void {
    this.useCurrentLocationForPickup();
  }

  /**
   * Get user-friendly status text
   */
  getStatusText(status: string | undefined): string {
    if (!status) return 'Processing';
    
    const statusMap: { [key: string]: string } = {
      'REQUESTED': 'Ride Requested',
      'ACCEPTED': 'Driver Assigned',
      'IN_PROGRESS': 'Ride in Progress',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled'
    };
    
    return statusMap[status] || status;
  }

  /**
   * Get status color class
   */
  getStatusColorClass(status: string | undefined): string {
    if (!status) return 'bg-gray-500';
    
    const colorMap: { [key: string]: string } = {
      'REQUESTED': 'bg-yellow-500',
      'ACCEPTED': 'bg-blue-500',
      'IN_PROGRESS': 'bg-green-500',
      'COMPLETED': 'bg-gray-500',
      'CANCELLED': 'bg-red-500'
    };
    
    return colorMap[status] || 'bg-purple-600';
  }

  /**
   * Get status icon
   */
  getStatusIcon(status: string | undefined): string {
    if (!status) return '⏳';
    
    const iconMap: { [key: string]: string } = {
      'REQUESTED': '🔍',
      'ACCEPTED': '✅',
      'IN_PROGRESS': '🚗',
      'COMPLETED': '🎉',
      'CANCELLED': '❌'
    };
    
    return iconMap[status] || '📍';
  }

  /**
   * Check if customer has an active ride
   * If yes, load it and start driver location tracking
   */
  private checkForActiveRide(): void {
    console.log('🔍 Checking for active ride...');
    this.isLoadingActiveRide = true;

    // First check localStorage via RideStateService
    const storedRide = this.rideStateService.getActiveRide();
    if (storedRide && storedRide.isActive) {
      console.log('📦 Found active ride in localStorage:', storedRide);
      this.activeRide = storedRide.ride;
      this.hasActiveRide = true;
      this.isLoadingActiveRide = false;
      this.lastStatusUpdate = new Date();
      this.displayActiveRide(storedRide.ride);
      return;
    }

    // If not in localStorage, check backend
    this.bookingService.getActiveRide().subscribe({
      next: (response: RideResponse) => {
        console.log('✅ Active ride found from backend:', response);
        this.activeRide = response;
        this.hasActiveRide = true;
        this.isLoadingActiveRide = false;
        this.lastStatusUpdate = new Date();
        
        // Store in RideStateService
        this.rideStateService.setActiveRide(response);
        
        // Display on map and start tracking
        this.displayActiveRide(response);
      },
      error: (err: Error) => {
        if (err.message === 'NO_ACTIVE_RIDE') {
          console.log('ℹ️ No active ride found - ready for new booking');
        } else {
          console.error('❌ Error checking active ride:', err);
        }
        this.hasActiveRide = false;
        this.isLoadingActiveRide = false;
      }
    });
  }

  /**
   * Display active ride on map and start driver location tracking
   */
  private displayActiveRide(ride: RideResponse): void {
    console.log('🗺️ Displaying active ride on map:', ride);
    
    // Wait for map to initialize
    setTimeout(() => {
      // Set pickup and drop markers if coordinates available
      if (ride.pickUpLatitude && ride.pickUpLongitude) {
        this.createOrMoveMarker('pickup', ride.pickUpLatitude, ride.pickUpLongitude);
        this.pickupLocation = {
          address: ride.pickUpLocation || '',
          city: '',
          state: '',
          pincode: '',
          coordinates: { lat: ride.pickUpLatitude, lng: ride.pickUpLongitude }
        };
      }
      
      if (ride.dropOffLatitude && ride.dropOffLongitude) {
        this.createOrMoveMarker('drop', ride.dropOffLatitude, ride.dropOffLongitude);
        this.dropLocation = {
          address: ride.destinationLocation || '',
          city: '',
          state: '',
          pincode: '',
          coordinates: { lat: ride.dropOffLatitude, lng: ride.dropOffLongitude }
        };
        
        // Update route
        this.updateRoute();
      }
      
      // Start driver location tracking if driver assigned
      if (ride.driverId) {
        this.startDriverLocationTracking(ride.driverId);
      }
      
      // Start ride status polling to detect completion
      if (ride.rideId) {
        this.startRideStatusPolling(ride.rideId);
      }
    }, 500);
  }

  /**
   * Start polling ride status to detect completion
   */
  private startRideStatusPolling(rideId: number): void {
    console.log('🔄 Starting ride status polling for ride:', rideId);
    
    // Stop any existing polling
    if (this.rideStatusSubscription) {
      this.rideStatusSubscription.unsubscribe();
    }
    
    // Poll ride status every 10 seconds
    this.rideStatusSubscription = new Observable<RideResponse>((observer) => {
      const intervalId = setInterval(() => {
        this.bookingService.getBookingById(rideId.toString()).subscribe({
          next: (rideDetails: RideResponse) => {
            observer.next(rideDetails);
          },
          error: (err) => {
            console.warn('⚠️ Ride status fetch failed:', err);
          }
        });
      }, 10000); // Poll every 10 seconds
      
      // Cleanup
      return () => {
        console.log('🛑 Stopped ride status polling');
        clearInterval(intervalId);
      };
    }).subscribe({
      next: (rideDetails: RideResponse) => {
        // Run inside Angular zone to trigger change detection
        this.zone.run(() => {
          console.log('🔄 Ride status update:', rideDetails.status);
          
          // Check if ride is completed or cancelled
          if (rideDetails.status === 'COMPLETED') {
            console.log('✅ Ride completed!');
            this.handleRideCompletion();
          } else if (rideDetails.status === 'CANCELLED') {
            console.log('🚫 Ride was cancelled');
            this.handleRideCancellation();
          } else {
            // Update active ride with latest status
            this.activeRide = rideDetails;
            this.lastStatusUpdate = new Date();
            this.rideStateService.updateActiveRide(rideDetails);
            console.log('📊 Active ride updated with status:', this.activeRide.status);
          }
        });
      }
    });
  }

  /**
   * Handle ride completion
   */
  private handleRideCompletion(): void {
    // Stop all polling
    if (this.driverLocationSubscription) {
      this.driverLocationSubscription.unsubscribe();
      this.driverLocationSubscription = null;
    }
    if (this.rideStatusSubscription) {
      this.rideStatusSubscription.unsubscribe();
      this.rideStatusSubscription = null;
    }
    
    // Clear active ride
    this.rideStateService.clearActiveRide();
    this.activeRide = null;
    this.hasActiveRide = false;
    
    // Remove driver marker
    if (this.driverMarker) {
      this.driverMarker.remove();
      this.driverMarker = undefined;
    }
    
    // Show completion message
    alert('🎉 Your ride has been completed! Thank you for using VCabs.');
    
    // Navigate to dashboard
    console.log('🏠 Navigating to dashboard after ride completion...');
    this.router.navigate(['/passenger/dashboard']);
  }

  /**
   * Handle ride cancellation (by driver or system)
   */
  private handleRideCancellation(): void {
    // Stop all polling
    if (this.driverLocationSubscription) {
      this.driverLocationSubscription.unsubscribe();
      this.driverLocationSubscription = null;
    }
    if (this.rideStatusSubscription) {
      this.rideStatusSubscription.unsubscribe();
      this.rideStatusSubscription = null;
    }
    
    // Clear active ride
    this.rideStateService.clearActiveRide();
    this.activeRide = null;
    this.hasActiveRide = false;
    
    // Remove driver marker
    if (this.driverMarker) {
      this.driverMarker.remove();
      this.driverMarker = undefined;
    }
    
    // Show cancellation message
    alert('⚠️ Your ride has been cancelled. Please book a new ride.');
    
    // Navigate to dashboard
    this.router.navigate(['/passenger/dashboard']);
  }

  /**
   * Start polling driver's location
   */
  private startDriverLocationTracking(driverId: number): void {
    console.log('📍 Starting driver location tracking for driver:', driverId);
    
    // Stop any existing polling
    if (this.driverLocationSubscription) {
      this.driverLocationSubscription.unsubscribe();
    }
    
    // Poll driver location every 5 seconds
    this.driverLocationSubscription = this.bookingService.pollDriverLocation(driverId, 5000).subscribe({
      next: (location: DriverLocation) => {
        console.log('📍 Driver location update:', location);
        this.updateDriverMarker(location.latitude, location.longitude);
        
        // Update active ride with latest driver location
        if (this.activeRide) {
          this.activeRide.driverLatitude = location.latitude;
          this.activeRide.driverLongitude = location.longitude;
          this.activeRide.driverLocationUpdatedAt = location.updatedAt;
          this.rideStateService.updateActiveRide(this.activeRide);
        }
      },
      error: (err) => {
        console.warn('⚠️ Driver location tracking error:', err);
        // Use mock location if API fails (for demo purposes)
        this.useMockDriverLocation();
      }
    });
  }

  /**
   * Update or create driver marker on map
   */
  private updateDriverMarker(lat: number, lng: number): void {
    if (!this.map) return;
    
    const driverIcon = L.divIcon({
      className: 'driver-marker',
      html: `<div class="w-10 h-10 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
               <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                 <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
               </svg>
             </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
    
    if (!this.driverMarker) {
      this.driverMarker = L.marker([lat, lng], { icon: driverIcon }).addTo(this.map);
      this.driverMarker.bindPopup('<strong>Your Driver</strong><br/>En route to pickup');
    } else {
      this.driverMarker.setLatLng([lat, lng]);
    }
  }

  /**
   * Use mock driver location for demo (when backend API unavailable)
   */
  private useMockDriverLocation(): void {
    if (!this.activeRide || !this.pickupLocation.coordinates) return;
    
    console.log('🎭 Using mock driver location');
    
    // Simulate driver moving towards pickup location
    const pickupLat = this.pickupLocation.coordinates.lat;
    const pickupLng = this.pickupLocation.coordinates.lng;
    
    // Start driver slightly offset from pickup
    let driverLat = pickupLat + 0.01;
    let driverLng = pickupLng + 0.01;
    
    this.updateDriverMarker(driverLat, driverLng);
    
    // Simulate movement every 5 seconds
    const mockInterval = setInterval(() => {
      // Move driver closer to pickup
      const latDiff = pickupLat - driverLat;
      const lngDiff = pickupLng - driverLng;
      
      driverLat += latDiff * 0.1;
      driverLng += lngDiff * 0.1;
      
      this.updateDriverMarker(driverLat, driverLng);
      
      // Stop when close enough
      if (Math.abs(latDiff) < 0.001 && Math.abs(lngDiff) < 0.001) {
        clearInterval(mockInterval);
        console.log('🎯 Driver reached pickup (mock)');
      }
    }, 5000);
  }

  /**
   * Cancel active ride
   */
  cancelActiveRide(): void {
    if (!this.activeRide || !this.activeRide.rideId) {
      console.warn('No active ride to cancel');
      alert('No active ride to cancel');
      return;
    }
    
    if (this.isCancellingRide) {
      console.log('Cancel already in progress');
      return;
    }
    
    if (!confirm('Are you sure you want to cancel this ride?')) {
      return;
    }
    
    this.isCancellingRide = true;
    console.log('🚫 Cancelling ride ID:', this.activeRide.rideId);
    
    this.bookingService.cancelBooking(this.activeRide.rideId.toString()).subscribe({
      next: (response) => {
        console.log('✅ Ride cancelled successfully:', response);
        this.isCancellingRide = false;
        
        // Clear active ride state
        this.rideStateService.clearActiveRide();
        this.activeRide = null;
        this.hasActiveRide = false;
        
        // Stop driver tracking
        if (this.driverLocationSubscription) {
          this.driverLocationSubscription.unsubscribe();
          this.driverLocationSubscription = null;
        }
        
        // Stop ride status polling
        if (this.rideStatusSubscription) {
          this.rideStatusSubscription.unsubscribe();
          this.rideStatusSubscription = null;
        }
        
        // Remove driver marker
        if (this.driverMarker) {
          this.driverMarker.remove();
          this.driverMarker = undefined;
        }
        
        alert('✅ Ride cancelled successfully!');
        
        // Navigate back to dashboard
        console.log('🏠 Navigating to dashboard...');
        this.router.navigate(['/passenger/dashboard']);
      },
      error: (err) => {
        console.error('❌ Error cancelling ride:', err);
        this.isCancellingRide = false;
        
        let errorMessage = 'Failed to cancel ride. Please try again.';
        if (err.message) {
          errorMessage = err.message;
        }
        alert(errorMessage);
      }
    });
  }
}