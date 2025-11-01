import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RideRequest {
  id: string;
  passengerName: string;
  pickupLocation: string;
  dropLocation: string;
  status: string;
  requestedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiUrl = 'http://localhost:8080/api/driver'; // ✅ Update with backend URL

  constructor(private http: HttpClient) {}

  // ---------------- Ride Request APIs ---------------- //

  getRideRequests(): Observable<RideRequest[]> {
    return this.http.get<RideRequest[]>(`${this.apiUrl}/ride-requests`);
  }

  acceptRideRequest(rideId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/ride-requests/${rideId}/accept`, {});
  }

  rejectRideRequest(rideId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/ride-requests/${rideId}/reject`, {});
  }

  // ---------------- Driver Dashboard APIs ---------------- //

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getEarnings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/earnings`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, profileData);
  }

}

