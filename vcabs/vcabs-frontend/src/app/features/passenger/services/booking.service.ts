import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Cab } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/customer/rides';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  getAvailableCabs(): Cab[] {
    return [
      {
        id: '1',
        type: '4-seater',
        name: 'Mini',
        basePrice: 40,
        pricePerKm: 12,
        image: 'assets/images/mini-car.jpg',
        features: ['AC', 'Music', '4 Seats']
      },
      {
        id: '2', 
        type: '4-seater',
        name: 'Sedan',
        basePrice: 60,
        pricePerKm: 15,
        image: 'assets/images/sedan-car.jpg',
        features: ['AC', 'Music', 'Comfort', '4 Seats']
      },
      {
        id: '3',
        type: '6-seater', 
        name: 'SUV',
        basePrice: 80,
        pricePerKm: 18,
        image: 'assets/images/suv-car.jpg',
        features: ['AC', 'Music', 'Spacious', '6 Seats']
      }
    ];
  }

  calculatePrice(cab: Cab, distance: number, tripType: 'single' | 'round'): number {
    let total = cab.basePrice + (cab.pricePerKm * distance);
    if (tripType === 'round') {
      total *= 2;
    }
    return Math.round(total);
  }

  createBooking(bookingDetails: any): Observable<any> {
    const rideRequestDto = {
      pickUpLocation: bookingDetails.pickupLocation.address,
      dropOffLocation: bookingDetails.dropLocation.address,
      pickUpLatitude: bookingDetails.pickupLocation.coordinates?.lat || 0,
      pickUpLongitude: bookingDetails.pickupLocation.coordinates?.lng || 0,
      dropOffLatitude: bookingDetails.dropLocation.coordinates?.lat || 0,
      dropOffLongitude: bookingDetails.dropLocation.coordinates?.lng || 0,
      distanceKm: Math.round(bookingDetails.distance),
      minitues: Math.round(bookingDetails.estimatedDuration),
      fare: Math.round(bookingDetails.totalAmount),
      cabType: this.mapCabTypeToBackend(bookingDetails.cab.type),
      RideType: 'LOCAL',
      numberOfCustomers: bookingDetails.passengers,
      scheduledTime: null,
      rentalHours: 0
    };

    console.log('🚗 Sending booking data to backend:', JSON.stringify(rideRequestDto, null, 2));
    
    const headers = this.getAuthHeaders();

    return this.http.post(`${this.apiUrl}/request`, rideRequestDto, { 
      headers,
      withCredentials: true 
    }).pipe(
      timeout(30000), // 30 second timeout
      map((response: any) => {
        console.log('✅ Booking successful - Full response:', response);
        
        // Handle different response formats more robustly
        let bookingData;
        if (response.data) {
          // Response wrapped in data object
          bookingData = response.data;
        } else if (response.result) {
          // Response wrapped in result object
          bookingData = response.result;
        } else {
          // Direct response
          bookingData = response;
        }

        // Try to extract booking ID from multiple possible fields
        const bookingId = bookingData.rideId || 
                         bookingData.id || 
                         bookingData.bookingId ||
                         response.rideId || 
                         response.id || 
                         response.bookingId;

        // Return the response even if no booking ID is found
        // The frontend will handle this gracefully
        return {
          ...bookingData,
          rideId: bookingId,
          bookingId: bookingId ? bookingId.toString() : null,
          originalResponse: response
        };
      }),
      catchError(this.handleError)
    );
  }

  private mapCabTypeToBackend(frontendCabType: string): string {
    const typeMap: {[key: string]: string} = {
      '4-seater': 'MINI',
      '6-seater': 'SUV'
    };
    return typeMap[frontendCabType] || 'MINI';
  }

  private handleError(error: HttpErrorResponse) {
    console.log('=== 🚨 FULL ERROR DETAILS ===');
    console.log('Error Status:', error.status);
    console.log('Error Status Text:', error.statusText);
    console.log('Error URL:', error.url);
    console.log('Error Body:', error.error);
    
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Network error. Please check your connection and ensure the backend server is running.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Bad request. Please check your input data.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 403:
          errorMessage = 'Access forbidden. Please check your permissions.';
          break;
        case 404:
          errorMessage = 'API endpoint not found. Please check the server URL.';
          break;
        case 500:
          errorMessage = error.error?.message || 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = `Server returned code: ${error.status}. Message: ${error.error?.message || error.message}`;
      }
    }
    
    console.error('HTTP Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getBookingById(bookingId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('📋 Fetching booking details for ID:', bookingId);
    return this.http.get(`${this.apiUrl}/${bookingId}`, { 
      headers,
      withCredentials: true 
    }).pipe(
      map((response: any) => {
        // Handle nested data structure
        return response.data || response;
      }),
      catchError(this.handleError)
    );
  }

  getBookingHistory(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/history`, { 
      headers,
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  cancelBooking(rideId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('❌ Cancelling booking:', rideId);
    return this.http.post(`${this.apiUrl}/${rideId}/cancel`, {}, { 
      headers,
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  getBookingDetails(bookingId: string): Observable<any> {
    return this.getBookingById(bookingId);
  }

  /**
   * Get customer's active ride if exists
   * Returns 404 if no active ride found
   */
  getActiveRide(): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('🔍 Fetching active ride...');
    return this.http.get(`${this.apiUrl}/active`, { 
      headers,
      withCredentials: true 
    }).pipe(
      map((response: any) => {
        console.log('✅ Active ride found:', response);
        return response.data || response;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          // No active ride is a normal case, not an error
          console.log('ℹ️ No active ride found');
          return throwError(() => new Error('NO_ACTIVE_RIDE'));
        }
        return this.handleError(error);
      })
    );
  }

  /**
   * Get driver's current location
   * @param driverId - Driver ID
   */
  getDriverLocation(driverId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!driverId || driverId <= 0) {
      console.warn('⚠️ Invalid driver ID:', driverId);
      return of(null);
    }
    
    return this.http.get(`http://localhost:8080/api/cabs/${driverId}/location`, { 
      headers,
      withCredentials: true 
    }).pipe(
      timeout(10000), // 10 second timeout
      catchError((error) => {
        // Handle different error scenarios
        if (error.status === 404) {
          console.log('ℹ️ Driver location not found (404) - driver may not be tracking location');
          return of(null); // Return null instead of throwing error
        } else if (error.status === 0) {
          console.warn('⚠️ Network error fetching driver location - check connection');
          return of(null);
        } else if (error.name === 'TimeoutError') {
          console.warn('⚠️ Timeout fetching driver location');
          return of(null);
        }
        console.warn('⚠️ Error fetching driver location:', error.status, error.message);
        return of(null); // Return null to allow graceful degradation
      })
    );
  }

  /**
   * Poll driver location at regular intervals with exponential backoff on errors
   * @param driverId - Driver ID
   * @param intervalMs - Polling interval in milliseconds (default: 5000ms = 5 seconds)
   */
  pollDriverLocation(driverId: number, intervalMs: number = 5000): Observable<any> {
    return new Observable(observer => {
      let consecutiveErrors = 0;
      let currentInterval = intervalMs;
      const maxInterval = 30000; // Max 30 seconds between polls
      const maxConsecutiveErrors = 5;
      let intervalId: any = null;
      
      const poll = () => {
        this.getDriverLocation(driverId).subscribe({
          next: (location) => {
            if (location && location.latitude != null && location.longitude != null) {
              // Reset error count on success
              consecutiveErrors = 0;
              if (currentInterval !== intervalMs) {
                // Reset interval if it was increased due to errors
                currentInterval = intervalMs;
                if (intervalId) {
                  clearInterval(intervalId);
                  intervalId = setInterval(poll, currentInterval);
                }
              }
              observer.next(location);
            } else {
              // Location is null or invalid - driver may not have started tracking yet
              console.debug('📍 Driver location not available yet');
              // Don't increment error count for null responses
              observer.next(null); // Still emit null to keep connection alive
            }
          },
          error: (err) => {
            consecutiveErrors++;
            console.warn(`⚠️ Driver location fetch failed (${consecutiveErrors}/${maxConsecutiveErrors}):`, err);
            
            // Exponential backoff on consecutive errors
            if (consecutiveErrors >= maxConsecutiveErrors) {
              const newInterval = Math.min(Math.round(currentInterval * 1.5), maxInterval);
              if (newInterval !== currentInterval) {
                currentInterval = newInterval;
                console.log(`⏱️ Increased polling interval to ${currentInterval}ms due to errors`);
                if (intervalId) {
                  clearInterval(intervalId);
                  intervalId = setInterval(poll, currentInterval);
                }
              }
            }
            
            // Emit error only if we've had too many consecutive failures
            if (consecutiveErrors >= maxConsecutiveErrors * 2) {
              console.error('❌ Too many consecutive errors, stopping polling');
              observer.error(err);
            } else {
              // Continue polling - emit null to keep observable alive
              observer.next(null);
            }
          }
        });
      };
      
      // Initial fetch
      poll();
      
      // Start polling at regular intervals
      intervalId = setInterval(poll, currentInterval);

      // Cleanup on unsubscribe
      return () => {
        console.log('🛑 Stopped polling driver location');
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      };
    });
  }
}