import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DriverService, RideResponseDto } from '../../../core/services/driver';
import * as L from 'leaflet';

@Component({
  selector: 'app-ride-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ride-tracking.html',
  styleUrls: ['./ride-tracking.css']
})
export class RideTracking implements OnInit, AfterViewInit, OnDestroy {
  rideId: number = 0;
  ride: RideResponseDto | null = null;
  otp: string | number = '';
  isLoading: boolean = true;
  isStarting: boolean = false;
  isCompleting: boolean = false;
  
  // Map related
  private map: L.Map | null = null;
  private pickupMarker: L.Marker | null = null;
  private dropoffMarker: L.Marker | null = null;
  private driverMarker: L.Marker | null = null;
  private routeLine: L.Polyline | null = null;
  private accuracyCircle: L.Circle | null = null;
  private locationUpdateInterval: any = null;
  private mapInitialized: boolean = false;
  
  // Driver's current location
  driverLat: number = 0;
  driverLng: number = 0;

  constructor(
    private driverService: DriverService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🗺️ Ride Tracking Component Initialized');
    
    // Get ride ID from route params
    this.route.paramMap.subscribe(params => {
      const id = params.get('rideId');
      if (id) {
        this.rideId = parseInt(id);
        console.log('🎯 Ride ID from route:', this.rideId);
        this.loadRideDetails();
      } else {
        console.error('❌ No ride ID in route params');
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    console.log('🔍 ngAfterViewInit called');
    // Map element will be created by *ngIf when ride loads
    // Don't initialize here, wait for ride data
  }

  ngOnDestroy(): void {
    // Clean up
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
    }
    if (this.accuracyCircle && this.map) {
      this.map.removeLayer(this.accuracyCircle);
    }
    if (this.map) {
      this.map.remove();
    }
  }

  /**
   * Load ride details from backend
   */
  loadRideDetails(): void {
    console.log('📊 Loading ride details for ID:', this.rideId);
    this.isLoading = true;
    
    // Get accepted ride from backend
    this.driverService.getAcceptedRides().subscribe({
      next: (response) => {
        console.log('✅ Ride details response:', response);
        
        // Check if response has ride data
        if (response && response.ride) {
          console.log('📋 Received ride ID:', response.ride.rideId, 'Expected ID:', this.rideId);
          
          // Accept any ride for now (backend auto-assigns, so we trust it)
          // If IDs don't match, it might be a newer ride assignment
          if (response.ride.rideId === this.rideId || response.ride.status === 'ACCEPTED' || response.ride.status === 'IN_PROGRESS') {
            this.ride = response.ride;
            console.log('✅ Ride loaded:', this.ride);
            console.log('📊 Ride status:', this.ride.status);
            this.isLoading = false;
            
            // Manually trigger change detection to update DOM immediately
            this.cdr.detectChanges();
            console.log('🔄 Change detection triggered');
            
            // Initialize map only if not already initialized
            if (!this.mapInitialized) {
              // Wait for Angular to render the *ngIf map container, then initialize map
              setTimeout(() => {
                console.log('🗺️ Attempting to initialize map after DOM update...');
                this.initializeMapWithRetry();
              }, 300);
            } else {
              console.log('✅ Map already initialized, ride data updated');
            }
          } else {
            console.warn('⚠️ Ride ID mismatch or invalid status. Received:', response.ride.rideId, 'Expected:', this.rideId);
            console.log('💡 Tip: Navigate from Ride Requests page to ensure correct ride ID');
            this.isLoading = false;
          }
        } else {
          console.error('❌ No ride data in response');
          console.log('💡 Possible reasons: No accepted rides, ride completed, or backend error');
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('❌ Error loading ride details:', err);
        console.error('📋 Error details:', {
          status: err.status,
          message: err.message,
          url: err.url
        });
        this.isLoading = false;
      }
    });
  }

  /**
   * Initialize map with retry logic
   */
  private initializeMapWithRetry(attempt: number = 1, maxAttempts: number = 5): void {
    const mapElement = document.getElementById('map');
    
    if (!mapElement) {
      console.warn(`⚠️ Map element not found (attempt ${attempt}/${maxAttempts})`);
      
      if (attempt < maxAttempts) {
        console.log(`🔄 Retrying in 200ms...`);
        setTimeout(() => {
          this.initializeMapWithRetry(attempt + 1, maxAttempts);
        }, 200);
      } else {
        console.error('❌ Failed to find map element after multiple attempts');
      }
      return;
    }
    
    console.log(`✅ Map element found on attempt ${attempt}`);
    this.initializeMap();
    
    // Wait for map to initialize, then add markers
    setTimeout(() => {
      if (this.map) {
        this.updateMapWithRideData();
        this.startLocationTracking();
        this.mapInitialized = true;
      }
    }, 300);
  }

  /**
   * Initialize Leaflet map (called once on component init)
   */
  private initializeMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('❌ Map element not found in DOM');
      return;
    }
    
    console.log('🗺️ Initializing Leaflet map...', {
      elementWidth: mapElement.offsetWidth,
      elementHeight: mapElement.offsetHeight
    });
    
    try {
      // Initialize map centered on India
      this.map = L.map('map', {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        attributionControl: true
      });
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        minZoom: 3
      }).addTo(this.map);
      
      console.log('✅ Map initialized successfully');
      
      // Force multiple invalidateSize calls to ensure proper rendering
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
          console.log('🔄 Map size invalidated (100ms)');
        }
      }, 100);
      
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
          console.log('🔄 Map size invalidated (300ms)');
        }
      }, 300);
      
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
          console.log('🔄 Map size invalidated (500ms)');
        }
      }, 500);
      
    } catch (error) {
      console.error('❌ Error initializing map:', error);
    }
  }

  /**
   * Update map with ride data (markers and route)
   */
  private updateMapWithRideData(): void {
    if (!this.ride || !this.map) {
      console.error('❌ Cannot update map - ride or map is null', { ride: !!this.ride, map: !!this.map });
      return;
    }
    
    console.log('🗺️ Updating map with ride data:', {
      pickUpLat: this.ride.pickUpLatitude,
      pickUpLng: this.ride.pickUpLongitude,
      dropOffLat: this.ride.dropOffLatitude,
      dropOffLng: this.ride.dropOffLongitude
    });
    
    // Force map to recalculate its size (important when becoming visible)
    // Multiple calls to ensure it works
    if (this.map) {
      this.map.invalidateSize();
      console.log('🔄 Map size invalidated (immediate)');
    }
    
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
        console.log('🔄 Map size invalidated (200ms)');
      }
    }, 200);
    
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
        console.log('🔄 Map size invalidated (400ms)');
      }
    }, 400);
    
    // Add pickup marker (green)
    if (this.ride.pickUpLatitude && this.ride.pickUpLongitude) {
      const pickupIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
      this.pickupMarker = L.marker(
        [this.ride.pickUpLatitude, this.ride.pickUpLongitude],
        { icon: pickupIcon }
      ).addTo(this.map);
      this.pickupMarker.bindPopup(`<b>📍 Pickup</b><br>${this.ride.pickUpLocation}`);
    }
    
    // Add dropoff marker (red)
    if (this.ride.dropOffLatitude && this.ride.dropOffLongitude) {
      const dropoffIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
      this.dropoffMarker = L.marker(
        [this.ride.dropOffLatitude, this.ride.dropOffLongitude],
        { icon: dropoffIcon }
      ).addTo(this.map);
      this.dropoffMarker.bindPopup(`<b>🎯 Dropoff</b><br>${this.ride.destinationLocation}`);
    }
    
    // Fetch and draw road-based route between pickup and dropoff
    if (this.ride.pickUpLatitude && this.ride.pickUpLongitude && 
        this.ride.dropOffLatitude && this.ride.dropOffLongitude) {
      this.fetchAndDrawRoute(
        this.ride.pickUpLatitude,
        this.ride.pickUpLongitude,
        this.ride.dropOffLatitude,
        this.ride.dropOffLongitude
      );
    }
    
    // Fit map to show all markers
    const bounds = L.latLngBounds([]);
    if (this.pickupMarker) bounds.extend(this.pickupMarker.getLatLng());
    if (this.dropoffMarker) bounds.extend(this.dropoffMarker.getLatLng());
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [80, 80] });
    }
    
    console.log('✅ Map updated with ride data');
  }

  /**
   * Fetch road-based route from OSRM and draw on map
   */
  private fetchAndDrawRoute(startLat: number, startLng: number, endLat: number, endLng: number): void {
    // OSRM API endpoint for routing
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    
    console.log('🛣️ Fetching road route from OSRM...');
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates;
          
          // Convert [lng, lat] to [lat, lng] for Leaflet
          const latLngs: [number, number][] = coordinates.map((coord: number[]) => [coord[1], coord[0]]);
          
          // Draw the route on map
          if (this.routeLine) {
            this.map?.removeLayer(this.routeLine);
          }
          
          this.routeLine = L.polyline(latLngs, {
            color: '#8B5CF6',
            weight: 5,
            opacity: 0.8,
            lineJoin: 'round',
            lineCap: 'round'
          }).addTo(this.map!);
          
          // Fit bounds to include the route
          const routeBounds = this.routeLine.getBounds();
          this.map?.fitBounds(routeBounds, { padding: [80, 80] });
          
          console.log('✅ Road route drawn successfully');
          console.log(`📏 Route distance: ${(route.distance / 1000).toFixed(2)} km`);
          console.log(`⏱️ Estimated duration: ${Math.round(route.duration / 60)} min`);
        } else {
          console.warn('⚠️ Could not fetch route, falling back to straight line');
          this.drawStraightLine(startLat, startLng, endLat, endLng);
        }
      })
      .catch(error => {
        console.error('❌ Error fetching route:', error);
        console.log('📍 Drawing straight line as fallback');
        this.drawStraightLine(startLat, startLng, endLat, endLng);
      });
  }

  /**
   * Fallback: Draw straight line if routing fails
   */
  private drawStraightLine(startLat: number, startLng: number, endLat: number, endLng: number): void {
    this.routeLine = L.polyline([
      [startLat, startLng],
      [endLat, endLng]
    ], {
      color: '#8B5CF6',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(this.map!);
  }

  /**
   * Start tracking driver's location
   */
  startLocationTracking(): void {
    console.log('📍 Starting location tracking...');
    
    // Get initial location
    this.updateDriverLocation();
    
    // Update location every 5 seconds
    this.locationUpdateInterval = setInterval(() => {
      this.updateDriverLocation();
    }, 5000);
  }

  /**
   * Update driver's current location on map
   */
  updateDriverLocation(): void {
    if (!navigator.geolocation) {
      console.error('❌ Geolocation not supported by this browser');
      alert('Your browser does not support location tracking. Please use a modern browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.driverLat = position.coords.latitude;
        this.driverLng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        console.log('📍 Driver location updated:', {
          lat: this.driverLat,
          lng: this.driverLng,
          accuracy: `${accuracy.toFixed(0)}m`,
          timestamp: new Date(position.timestamp).toLocaleTimeString()
        });
        
        // Update or create driver marker (blue)
        if (this.map) {
          if (this.driverMarker) {
            // Update existing marker position with smooth animation
            this.driverMarker.setLatLng([this.driverLat, this.driverLng]);
            console.log('🔄 Driver marker position updated');
          } else {
            // Create new driver marker with custom icon
            const driverIcon = L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
            
            this.driverMarker = L.marker(
              [this.driverLat, this.driverLng],
              { icon: driverIcon }
            ).addTo(this.map);
            
            this.driverMarker.bindPopup(`
              <div style="text-align: center;">
                <b>🚗 Your Location</b><br>
                <small>Accuracy: ${accuracy.toFixed(0)}m</small>
              </div>
            `);
            
            console.log('✅ Driver marker created');
            
            // Center map on driver location on first update
            this.map.setView([this.driverLat, this.driverLng], 15);
          }
          
          // Update accuracy circle
          if (this.accuracyCircle) {
            this.map.removeLayer(this.accuracyCircle);
          }
          
          if (accuracy < 100) {
            // Only show accuracy circle if accuracy is good (< 100m)
            this.accuracyCircle = L.circle([this.driverLat, this.driverLng], {
              radius: accuracy,
              color: '#3B82F6',
              fillColor: '#3B82F6',
              fillOpacity: 0.15,
              weight: 2,
              opacity: 0.5
            }).addTo(this.map);
          }
        }
        
        // Send location to backend for passenger tracking
        if (this.ride && this.ride.driverId) {
          this.driverService.updateDriverLocation(
            this.ride.driverId, 
            this.driverLat, 
            this.driverLng
          ).subscribe({
            next: (response) => {
              console.log('✅ Location sent to backend:', response);
            },
            error: (err) => {
              // Log error but don't interrupt location tracking
              console.warn('⚠️ Failed to send location to backend:', err);
            }
          });
        }
      },
      (error) => {
        console.error('❌ Error getting location:', error);
        
        let errorMessage = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            console.error('🚫 Location permission denied by user');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            console.error('📡 Location information unavailable');
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Trying again...';
            console.error('⏱️ Location request timeout');
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            console.error('❓ Unknown location error');
        }
        
        console.warn('💡 Error details:', {
          code: error.code,
          message: error.message
        });
      },
      {
        enableHighAccuracy: true,  // Use GPS if available
        timeout: 10000,             // Increased timeout to 10 seconds
        maximumAge: 0               // Don't use cached position
      }
    );
  }

  /**
   * Start ride with OTP
   */
  startRide(): void {
    if (!this.ride) return;
    
    // Convert OTP to string for validation
    const otpString = String(this.otp || '').trim();
    
    if (!otpString || otpString.length === 0) {
      alert('Please enter the OTP provided by the passenger');
      return;
    }
    
    // Validate OTP is a number
    const otpNumber = parseInt(otpString);
    if (isNaN(otpNumber)) {
      alert('Please enter a valid numeric OTP');
      return;
    }
    
    console.log('🚀 Starting ride with OTP:', otpNumber);
    this.isStarting = true;
    
    this.driverService.startRide(this.rideId, otpNumber).subscribe({
      next: (response) => {
        console.log('✅ Ride started successfully:', response);
        alert('Ride started successfully! The ride is now in progress.');
        this.isStarting = false;
        this.otp = '';
        
        // Reload ride details to get updated status
        // Reset map initialization flag to allow re-render
        this.mapInitialized = false;
        this.loadRideDetails();
      },
      error: (err) => {
        console.error('❌ Error starting ride:', err);
        this.isStarting = false;
        
        // Try to get error message from backend
        let errorMessage = 'Failed to start ride. Please try again.';
        
        if (err.status === 400) {
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else {
            errorMessage = 'Invalid OTP. Please use 1243 for testing.';
          }
        } else if (err.status === 403) {
          errorMessage = 'This is not your ride.';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        
        alert(errorMessage);
      }
    });
  }

  /**
   * Complete ride
   */
  completeRide(): void {
    if (!this.ride) return;
    
    if (!confirm('Are you sure you want to complete this ride?')) {
      return;
    }
    
    console.log('🏁 Completing ride...');
    this.isCompleting = true;
    
    this.driverService.completeRide(this.rideId).subscribe({
      next: (response) => {
        console.log('✅ Ride completed successfully:', response);
        alert('Ride completed successfully!');
        this.isCompleting = false;
        
        // Navigate to earnings page
        this.router.navigate(['/driver/earnings']);
      },
      error: (err) => {
        console.error('❌ Error completing ride:', err);
        this.isCompleting = false;
        alert('Failed to complete ride. Please try again.');
      }
    });
  }
}
