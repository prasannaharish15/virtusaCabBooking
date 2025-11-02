import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// ============ Interfaces (Matching Backend DTOs EXACTLY) ============ //

// Matches RideResponseDto from backend
export interface RideResponseDto {
  rideId: number;
  driverId: number;
  driverName: string;
  driverPhoneNumber: string;
  customerId: number;
  customerName: string;
  customerPhoneNumber: string;
  pickUpLocation: string;
  destinationLocation: string;
  scheduledDateTime: string;
  distance: number;
  durationMinutes: number;
  fare: number;
  status: string;
  pickUpLatitude?: number;
  pickUpLongitude?: number;
  dropOffLatitude?: number;
  dropOffLongitude?: number;
  driverLatitude?: number;
  driverLongitude?: number;
  driverLocationUpdatedAt?: string;
}

// Matches DriverHomePageDto from backend
export interface DriverHomePageDto {
  driverName: string;
  driverId: number;
  todayRideNo: number;
  todayEarnings: number;
}

// Matches HistoryDTO from backend
export interface HistoryDTO {
  rideId: number;
  id: number;
  name: string;
  phone: string;
  pickUpLocation: string;
  dropOffLocation: string;
  acceptAt: string;
  startedAt: string;
  completedAt: string;
  distanceKm: number;
  durationMinutes: number;
  fare: number;
  status: string;
  cabType?: string;
  rideType?: string;
}

// Matches DriverDetailDto from backend
export interface DriverDetailDto {
  id: number;
  userId: number;
  userName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  vehicleNumber: string;
  make: string;
  model: string;
  color: string;
  licenceExpiryDate: string;
}

// For availability update request
export interface DriverAvailabilityDto {
  available: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiUrl = 'http://localhost:8080/api/driver';

  constructor(private http: HttpClient) {}

  // ============ Dashboard & Homepage APIs ============ //

  /**
   * GET /api/driver/driverhomepage
   * Get driver homepage data (dashboard stats, earnings, rides)
   * Returns: DriverHomePageDto {driverName, driverId, todayRideNo, todayEarnings}
   */
  getDriverHomepage(): Observable<DriverHomePageDto> {
    const url = `${this.apiUrl}/driverhomepage`;
    console.log('🔵 API REQUEST:', url);
    console.log('🔵 Method: GET');
    console.log('🔵 Headers:', {
      Authorization: `Bearer ${localStorage.getItem('authToken')?.substring(0, 20)}...`
    });
    
    return this.http.get<DriverHomePageDto>(url).pipe(
      tap(response => {
        console.log('✅ API RESPONSE SUCCESS:', url);
        console.log('✅ Response Data:', response);
      }),
      catchError(error => {
        console.error('❌ API ERROR:', url);
        console.error('❌ Status:', error.status);
        console.error('❌ Error:', error);
        console.error('❌ Error Body:', error.error);
        return throwError(() => error);
      })
    );
  }

  // ============ Ride Management APIs ============ //

  /**
   * GET /api/driver/accepted
   * Get accepted rides (rides assigned to driver)
   * Backend automatically assigns rides, no manual accept needed
   * Backend returns: {ride: RideResponseDto}
   */
  getAcceptedRides(): Observable<{ride: RideResponseDto}> {
    const url = `${this.apiUrl}/accepted`;
    console.log('🔵 API REQUEST:', url);
    console.log('🔵 Method: GET');
    console.log('🔵 Headers:', {
      Authorization: `Bearer ${localStorage.getItem('authToken')?.substring(0, 20)}...`
    });
    
    return this.http.get<{ride: RideResponseDto}>(url).pipe(
      tap(response => {
        console.log('✅ API RESPONSE SUCCESS:', url);
        console.log('✅ Response Data:', response);
      }),
      catchError(error => {
        console.error('❌ API ERROR:', url);
        console.error('❌ Status:', error.status);
        console.error('❌ Error:', error);
        console.error('❌ Error Body:', error.error);
        return throwError(() => error);
      })
    );
  }

  /**
   * POST /api/driver/{rideId}/start/{otp}
   * Start a ride with OTP verification
   * @param rideId - The ride ID
   * @param otp - OTP provided by passenger (currently hardcoded as 1243 in backend)
   * Returns: {message: string}
   */
  startRide(rideId: number, otp: number): Observable<{message: string}> {
    const url = `${this.apiUrl}/${rideId}/start/${otp}`;
    console.log('🔵 API REQUEST:', url);
    console.log('🔵 Method: POST');
    console.log('🔵 Params:', { rideId, otp });
    
    return this.http.post<{message: string}>(url, {}).pipe(
      tap(response => {
        console.log('✅ API RESPONSE SUCCESS:', url);
        console.log('✅ Response Data:', response);
      }),
      catchError(error => {
        console.error('❌ API ERROR:', url);
        console.error('❌ Status:', error.status);
        console.error('❌ Error:', error);
        console.error('❌ Error Body:', error.error);
        return throwError(() => error);
      })
    );
  }

  /**
   * POST /api/driver/{rideId}/complete
   * Complete a ride
   * @param rideId - The ride ID
   * Returns: {message: string}
   */
  completeRide(rideId: number): Observable<{message: string}> {
    const url = `${this.apiUrl}/${rideId}/complete`;
    console.log('🔵 API REQUEST:', url);
    console.log('🔵 Method: POST');
    console.log('🔵 Params:', { rideId });
    
    return this.http.post<{message: string}>(url, {}).pipe(
      tap(response => {
        console.log('✅ API RESPONSE SUCCESS:', url);
        console.log('✅ Response Data:', response);
      }),
      catchError(error => {
        console.error('❌ API ERROR:', url);
        console.error('❌ Status:', error.status);
        console.error('❌ Error:', error);
        console.error('❌ Error Body:', error.error);
        return throwError(() => error);
      })
    );
  }

  /**
   * POST /api/driver/{rideId}/cancel
   * Cancel/Reject a ride
   * @param rideId - The ride ID
   * Returns: Response from backend
   */
  cancelRide(rideId: number): Observable<any> {
    const url = `${this.apiUrl}/${rideId}/cancel`;
    console.log('🔵 API REQUEST:', url);
    console.log('🔵 Method: POST');
    console.log('🔵 Params:', { rideId });
    
    return this.http.post(url, {}).pipe(
      tap(response => {
        console.log('✅ API RESPONSE SUCCESS:', url);
        console.log('✅ Response Data:', response);
      }),
      catchError(error => {
        console.error('❌ API ERROR:', url);
        console.error('❌ Status:', error.status);
        console.error('❌ Error:', error);
        console.error('❌ Error Body:', error.error);
        return throwError(() => error);
      })
    );
  }

  /**
   * GET /api/driver/history
   * Get driver ride history
   * Returns: Array of HistoryDTO
   */
  getRideHistory(): Observable<HistoryDTO[]> {
    const url = `${this.apiUrl}/history`;
    console.log('🔵 API REQUEST:', url);
    console.log('🔵 Method: GET');
    
    return this.http.get<HistoryDTO[]>(url).pipe(
      tap(response => {
        console.log('✅ API RESPONSE SUCCESS:', url);
        console.log('✅ Response Data:', response);
        console.log('✅ History Count:', response.length);
      }),
      catchError(error => {
        console.error('❌ API ERROR:', url);
        console.error('❌ Status:', error.status);
        console.error('❌ Error:', error);
        console.error('❌ Error Body:', error.error);
        return throwError(() => error);
      })
    );
  }

  // ============ Driver Profile APIs ============ //

  /**
   * GET /api/driver/profiledata
   * Get driver profile data
   * Backend returns: {data: DriverDetailDto}
   */
  getProfileData(): Observable<{data: DriverDetailDto}> {
    const url = `${this.apiUrl}/profiledata`;
    console.log('🔵 API REQUEST:', url);
    console.log('🔵 Method: GET');
    
    return this.http.get<{data: DriverDetailDto}>(url).pipe(
      tap(response => {
        console.log('✅ API RESPONSE SUCCESS:', url);
        console.log('✅ Response Data:', response);
      }),
      catchError(error => {
        console.error('❌ API ERROR:', url);
        console.error('❌ Status:', error.status);
        console.error('❌ Error:', error);
        console.error('❌ Error Body:', error.error);
        return throwError(() => error);
      })
    );
  }

  /**
   * POST /api/driver/updatedriverprofile
   * Update driver profile
   * @param profileData - RegisterUserRequest with driver details
   * Returns: {message: string}
   */
  updateDriverProfile(profileData: any): Observable<{message: string}> {
    const url = `${this.apiUrl}/updatedriverprofile`;
    console.log('🔵 API REQUEST:', url);
    console.log('🔵 Method: POST');
    console.log('🔵 Body:', profileData);
    
    return this.http.post<{message: string}>(url, profileData).pipe(
      tap(response => {
        console.log('✅ API RESPONSE SUCCESS:', url);
        console.log('✅ Response Data:', response);
      }),
      catchError(error => {
        console.error('❌ API ERROR:', url);
        console.error('❌ Status:', error.status);
        console.error('❌ Error:', error);
        console.error('❌ Error Body:', error.error);
        return throwError(() => error);
      })
    );
  }

  // ============ Availability APIs ============ //

  /**
   * POST /api/driver/availability
   * Update driver availability status
   * @param isAvailable - true for online, false for offline
   * Request body: DriverAvailabilityDto {available: boolean}
   * Returns: {Message: string}
   */
  updateAvailability(isAvailable: boolean): Observable<{Message: string}> {
    const url = `${this.apiUrl}/availability`;
    const body: DriverAvailabilityDto = { available: isAvailable };
    console.log('🔵 API REQUEST:', url);
    console.log('🔵 Method: POST');
    console.log('🔵 Body:', body);
    
    return this.http.post<{Message: string}>(url, body).pipe(
      tap(response => {
        console.log('✅ API RESPONSE SUCCESS:', url);
        console.log('✅ Response Data:', response);
      }),
      catchError(error => {
        console.error('❌ API ERROR:', url);
        console.error('❌ Status:', error.status);
        console.error('❌ Error:', error);
        console.error('❌ Error Body:', error.error);
        return throwError(() => error);
      })
    );
  }

}

