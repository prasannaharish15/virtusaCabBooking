# Driver Module - Backend API Integration Guide

## 🔗 API Endpoints Mapping

### **Base URL**: `http://localhost:8080/api/driver`

---

## 📊 Dashboard & Homepage

### **GET /api/driver/driverhomepage**
**Purpose**: Get driver dashboard data including stats and earnings  
**Authentication**: Required (JWT Token)  
**Frontend Usage**: Dashboard component, Earnings page

**Response Data**:
```typescript
{
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  todayEarnings: number;
  pendingRides: number;
  rating?: number;
  onlineTime?: string;
}
```

**Frontend Service Method**:
```typescript
getDriverHomepage(): Observable<DriverHomepageData>
```

**Used In**:
- ✅ Dashboard component (Today's Summary)
- ✅ Earnings page (Today's earnings)

---

## 🚗 Ride Management

### **GET /api/driver/accepted**
**Purpose**: Get rides that have been automatically assigned/accepted by backend  
**Authentication**: Required  
**Frontend Usage**: Ride Requests page, Dashboard

**Response**: Array of accepted rides
```typescript
{
  id: number;
  passengerName: string;
  pickupLocation: string;
  dropLocation: string;
  fare: number;
  distance: number;
  status: string;
  otp?: number;
  requestedAt: string;
}[]
```

**Frontend Service Method**:
```typescript
getAcceptedRides(): Observable<AcceptedRide[]>
```

**Used In**:
- ✅ Ride Requests page (display accepted rides)
- ✅ Dashboard (show pending rides count)

**Important Notes**:
- ❌ No manual "accept" endpoint needed
- ✅ Backend automatically assigns rides to available drivers
- ✅ Frontend just fetches and displays accepted rides
- ✅ "Accept" button in UI should navigate to start ride flow

---

### **POST /api/driver/{rideId}/start/{otp}**
**Purpose**: Start a ride with OTP verification  
**Authentication**: Required  
**Frontend Usage**: Ride Tracking page

**Request**:
- Path params: `rideId` (number), `otp` (number)
- Body: Empty `{}`

**Frontend Service Method**:
```typescript
startRide(rideId: number, otp: number): Observable<any>
```

**Used In**:
- ✅ Ride Tracking page (Start Ride section)

**Flow**:
1. Driver receives accepted ride
2. Driver navigates to ride tracking
3. Passenger provides OTP
4. Driver enters OTP and clicks "Start Ride"
5. Backend verifies OTP and starts ride

---

### **POST /api/driver/{rideId}/complete**
**Purpose**: Complete/End a ride  
**Authentication**: Required  
**Frontend Usage**: Ride Tracking page

**Request**:
- Path param: `rideId` (number)
- Body: Empty `{}`

**Frontend Service Method**:
```typescript
completeRide(rideId: number): Observable<any>
```

**Used In**:
- ✅ Ride Tracking page (Complete Ride section)

**Flow**:
1. Ride is in progress
2. Driver reaches destination
3. Driver selects payment mode (frontend only)
4. Driver clicks "Complete Ride"
5. Backend marks ride as completed

---

### **POST /api/driver/{rideId}/cancel**
**Purpose**: Cancel/Reject a ride  
**Authentication**: Required  
**Frontend Usage**: Ride Requests page, Ride Tracking page

**Request**:
- Path param: `rideId` (number)
- Body: Empty `{}`

**Frontend Service Method**:
```typescript
cancelRide(rideId: number): Observable<any>
```

**Used In**:
- ✅ Ride Requests page (Reject button)
- ✅ Dashboard (Reject incoming request)

**Use Cases**:
- Driver rejects an accepted ride
- Driver cancels ongoing ride (emergency)

---

### **GET /api/driver/history**
**Purpose**: Get driver's ride history  
**Authentication**: Required  
**Frontend Usage**: Earnings page (for earnings history)

**Response**: Array of completed rides
```typescript
{
  id: number;
  passengerName: string;
  pickupLocation: string;
  dropLocation: string;
  fare: number;
  paymentMode: string;
  completedAt: string;
  rating?: number;
}[]
```

**Frontend Service Method**:
```typescript
getRideHistory(): Observable<RideHistory[]>
```

**Used In**:
- ✅ Earnings page (display earnings history)

---

## 👤 Driver Profile

### **GET /api/driver/profiledata**
**Purpose**: Get driver profile information  
**Authentication**: Required  
**Frontend Usage**: Profile page

**Response**:
```typescript
{
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: string;
  licenseNumber: string;
}
```

**Frontend Service Method**:
```typescript
getProfileData(): Observable<DriverProfile>
```

**Used In**:
- ✅ Profile page (load existing data)

---

### **POST /api/driver/updatedriverprofile**
**Purpose**: Update driver profile  
**Authentication**: Required  
**Frontend Usage**: Profile page

**Request Body**:
```typescript
{
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: string;
  licenseNumber: string;
  // ... other profile fields
}
```

**Frontend Service Method**:
```typescript
updateDriverProfile(profileData: any): Observable<any>
```

**Used In**:
- ✅ Profile page (save button)

---

## 🟢 Availability Management

### **POST /api/driver/availability**
**Purpose**: Update driver online/offline status  
**Authentication**: Required  
**Frontend Usage**: Dashboard (Availability toggle)

**Request Body**:
```typescript
{
  available: boolean  // true = online, false = offline
}
```

**Frontend Service Method**:
```typescript
updateAvailability(isAvailable: boolean): Observable<any>
```

**Used In**:
- ✅ Dashboard (Availability Status section)

---

## 🚫 Endpoints NOT Used (Future Features)

### **GET /api/driver/getPendingRide/{type}**
**Purpose**: Get pending rides by type (ADVANCE, RESERVE, RENTAL, INTERCITY)  
**Status**: ❌ NOT IMPLEMENTED YET  
**Reason**: These ride types are not yet developed in passenger module

---

## 📋 Integration Checklist

### ✅ Completed Integrations
- [x] DriverService created with all endpoints
- [x] Interfaces defined for all API responses
- [x] Dashboard uses `getDriverHomepage()`
- [x] Ride Requests uses `getAcceptedRides()`
- [x] Ride Tracking uses `startRide()` and `completeRide()`
- [x] Cancel/Reject uses `cancelRide()`
- [x] Earnings uses `getDriverHomepage()` and `getRideHistory()`
- [x] Profile uses `getProfileData()` and `updateDriverProfile()`
- [x] Availability toggle uses `updateAvailability()`

### 🔄 Pending Integrations (Need to connect components)
- [ ] Dashboard component - connect to `getDriverHomepage()`
- [ ] Ride Requests component - connect to `getAcceptedRides()`
- [ ] Ride Tracking component - connect to `startRide()` and `completeRide()`
- [ ] Earnings component - connect to `getRideHistory()`
- [ ] Profile component - connect to `getProfileData()` and `updateDriverProfile()`
- [ ] Availability toggle - connect to `updateAvailability()`

---

## 🔐 Authentication

All endpoints require JWT authentication token in the header:
```typescript
Authorization: Bearer <token>
```

The token should be stored in `localStorage` after login and automatically included in all HTTP requests via an HTTP interceptor.

---

## 🎯 Frontend Service Usage Example

```typescript
import { DriverService } from '@core/services/driver';

export class DashboardComponent {
  constructor(private driverService: DriverService) {}

  ngOnInit() {
    // Get dashboard data
    this.driverService.getDriverHomepage().subscribe({
      next: (data) => {
        this.todayRides = data.totalRides;
        this.todayEarnings = data.todayEarnings;
        this.rating = data.rating;
      },
      error: (err) => console.error('Error loading dashboard:', err)
    });

    // Get accepted rides
    this.driverService.getAcceptedRides().subscribe({
      next: (rides) => {
        this.pendingRides = rides;
      },
      error: (err) => console.error('Error loading rides:', err)
    });
  }

  startRide(rideId: number, otp: number) {
    this.driverService.startRide(rideId, otp).subscribe({
      next: () => {
        console.log('Ride started successfully');
        // Navigate or update UI
      },
      error: (err) => console.error('Error starting ride:', err)
    });
  }
}
```

---

## 🔄 Ride Flow

### Complete Ride Lifecycle:

1. **Backend Auto-Assignment**
   - Backend automatically assigns available rides to online drivers
   - No manual accept needed

2. **Driver Views Accepted Rides**
   - `GET /api/driver/accepted` - Fetch assigned rides
   - Display in Ride Requests page

3. **Driver Starts Ride**
   - Driver clicks "Accept" → Navigate to Ride Tracking
   - Driver gets OTP from passenger
   - `POST /api/driver/{rideId}/start/{otp}` - Start with OTP verification

4. **Ride In Progress**
   - Driver navigates to destination
   - Real-time tracking (if implemented)

5. **Driver Completes Ride**
   - Driver selects payment mode (frontend only)
   - `POST /api/driver/{rideId}/complete` - Mark as completed
   - Navigate to Earnings page

6. **Alternative: Cancel Ride**
   - `POST /api/driver/{rideId}/cancel` - Cancel/Reject ride
   - Can be done before or during ride

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│   Dashboard     │
│                 │
│ getDriverHome   │──────► totalRides, todayEarnings, rating
│ page()          │
└─────────────────┘

┌─────────────────┐
│ Ride Requests   │
│                 │
│ getAccepted     │──────► List of assigned rides
│ Rides()         │
│                 │
│ cancelRide()    │──────► Reject a ride
└─────────────────┘

┌─────────────────┐
│ Ride Tracking   │
│                 │
│ startRide()     │──────► Start with OTP
│                 │
│ completeRide()  │──────► End ride
└─────────────────┘

┌─────────────────┐
│   Earnings      │
│                 │
│ getRideHistory()│──────► Past rides with earnings
└─────────────────┘

┌─────────────────┐
│   Profile       │
│                 │
│ getProfileData()│──────► Load profile
│                 │
│ updateDriver    │──────► Save changes
│ Profile()       │
└─────────────────┘
```

---

## ⚠️ Important Notes

1. **No Manual Accept Endpoint**
   - Backend handles ride assignment automatically
   - Frontend "Accept" button is just for navigation to start ride flow

2. **OTP-Based Start**
   - Always use `POST /api/driver/{rideId}/start/{otp}`
   - Never use the deprecated `POST /api/driver/{driverId}/start`

3. **Earnings from Homepage**
   - Use `getDriverHomepage()` for dashboard earnings
   - Use `getRideHistory()` for detailed earnings list

4. **Cancel = Reject**
   - Same endpoint for both reject and cancel
   - `POST /api/driver/{rideId}/cancel`

5. **Future Ride Types**
   - ADVANCE, RESERVE, RENTAL, INTERCITY not yet implemented
   - Don't use `getPendingRide/{type}` endpoint

---

## 🚀 Next Steps

1. **Connect Components to Service**
   - Update Dashboard to use `getDriverHomepage()`
   - Update Ride Requests to use `getAcceptedRides()`
   - Update Ride Tracking to use `startRide()` and `completeRide()`
   - Update Earnings to use `getRideHistory()`
   - Update Profile to use profile endpoints

2. **Add Error Handling**
   - Implement proper error messages
   - Add loading states
   - Handle network failures

3. **Add Real-time Updates**
   - Consider WebSocket for live ride updates
   - Polling for new accepted rides

4. **Testing**
   - Test all API integrations
   - Verify OTP flow
   - Test cancel/reject scenarios

---

**Last Updated**: November 2, 2024  
**Status**: ✅ Service Updated, Components Need Integration  
**Backend Base URL**: `http://localhost:8080/api/driver`
