# Backend 500 Error - Debugging Guide

## 🚨 Problem
Both API endpoints are returning **500 Internal Server Error**:
- `GET /api/driver/driverhomepage` → 500
- `GET /api/driver/accepted` → 500

This means the **backend is crashing** when processing these requests.

---

## 🔍 Step 1: Check Backend Logs

### Check Spring Boot Console
Look for error stack traces in your backend console. Common errors:

**NullPointerException:**
```
java.lang.NullPointerException: Cannot invoke "com.secBackend.cab_backend.model.DriverProfile.getId()" because the return value of "com.secBackend.cab_backend.model.User.getDriverProfile()" is null
```

**Solution:** Driver doesn't have a DriverProfile

**Database Connection Error:**
```
org.springframework.dao.DataAccessResourceFailureException: Unable to acquire JDBC Connection
```

**Solution:** Database not running or wrong credentials

---

## 🔧 Step 2: Most Likely Cause

### **Driver Has No DriverProfile**

The logged-in user is a driver but doesn't have a `DriverProfile` record in the database.

**Check in `DriverService.java` line 122:**
```java
DriverProfile driverProfile = currUser.getDriverProfile(); // This is NULL!
```

**Then line 125 crashes:**
```java
driverHomePageDto.setDriverId(currUser.getId()); // Works
driverHomePageDto.setDriverName(currUser.getUsername()); // Works

// Line 128 - CRASH! driverProfile is null
List<RideRequest> allRides = rideRequestRepository.findAllByDriver_Id(currUser.getId());
```

---

## ✅ Step 3: Fix the Backend

### Option 1: Add Null Check (Quick Fix)

**File:** `DriverService.java`

```java
public ResponseEntity<?> getDriverHomePageData(String email) {
    User currUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    // ADD NULL CHECK
    if (currUser.getDriverProfile() == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Driver profile not found. Please complete your profile."));
    }

    DriverProfile driverProfile = currUser.getDriverProfile();
    DriverHomePageDto driverHomePageDto = new DriverHomePageDto();

    driverHomePageDto.setDriverId(currUser.getId());
    driverHomePageDto.setDriverName(currUser.getUsername());

    List<RideRequest> allRides = rideRequestRepository.findAllByDriver_Id(currUser.getId());

    // Filter today's rides
    LocalDate today = LocalDate.now();
    List<RideRequest> todaysRides = allRides.stream()
            .filter(ride -> ride.getCompletedAt()!=null && 
                    ride.getCompletedAt().toLocalDate().isEqual(today))
            .toList();

    driverHomePageDto.setTodayRideNo(todaysRides.size());
    driverHomePageDto.setTodayEarnings((int) todaysRides.stream()
            .mapToDouble(RideRequest::getFare)
            .sum());

    return ResponseEntity.ok(driverHomePageDto);
}
```

### Option 2: Create Driver Profile (Database Fix)

**Check if driver has profile:**
```sql
SELECT u.id, u.email, u.username, dp.id as profile_id 
FROM users u 
LEFT JOIN driver_profile dp ON u.id = dp.user_id 
WHERE u.role = 'DRIVER';
```

**If profile is missing, create one:**
```sql
INSERT INTO driver_profile (
    user_id, 
    license_number, 
    vehicle_number, 
    make, 
    model, 
    color, 
    licence_expiry_date, 
    available
) VALUES (
    <USER_ID>, 
    'DL123456', 
    'KA01AB1234', 
    'Toyota', 
    'Innova', 
    'White', 
    '2025-12-31', 
    true
);
```

---

## 🔧 Step 4: Fix Accepted Rides Endpoint

**File:** `DriverRideService.java`

```java
public ResponseEntity<?> getAcceptedDriverRide(String email) {
    // 1️⃣ Fetch driver from DB
    User driver = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Driver not found"));

    // ADD NULL CHECK
    if (driver.getDriverProfile() == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Driver profile not found"));
    }

    // 2️⃣ Find accepted ride for this driver
    Optional<RideRequest> currRide = rideRequestRepository.findByDriver_IdAndStatus(
            driver.getId(), RideRequest.RideStatus.ACCEPTED);

    if (currRide.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "No accepted ride found"));
    }

    RideRequest ride = currRide.get();

    // 3️⃣ Build DTO response
    RideResponseDto dto = new RideResponseDto();
    dto.setRideId(ride.getId());

    // Driver info
    dto.setDriverId(driver.getId());
    dto.setDriverName(driver.getUsername());
    dto.setDriverPhoneNumber(driver.getPhoneNumber());

    // Customer info
    if (ride.getUser() != null) {
        dto.setCustomerId(ride.getUser().getId());
        dto.setCustomerName(ride.getUser().getUsername());
        dto.setCustomerPhoneNumber(ride.getUser().getPhoneNumber());
    }

    // Ride details
    dto.setPickUpLocation(ride.getPickUpLocation());
    dto.setDestinationLocation(ride.getDestinationLocation());
    dto.setScheduledDateTime(ride.getScheduledTime());
    dto.setDistance(ride.getDistanceKm());
    dto.setDurationMinutes(ride.getDurationMinutes());
    dto.setFare(ride.getFare());
    dto.setStatus(ride.getStatus().name());

    // Pickup & drop coordinates
    dto.setPickUpLatitude(ride.getPickUpLatitude());
    dto.setPickUpLongitude(ride.getPickUpLongitude());
    dto.setDropOffLatitude(ride.getDestinationLatitude());
    dto.setDropOffLongitude(ride.getDestinationLongitude());

    // 4️⃣ Return JSON response
    return ResponseEntity.ok(Map.of("ride", dto));
}
```

---

## 🧪 Step 5: Test with Postman/curl

### Test Homepage API
```bash
curl -X GET http://localhost:8080/api/driver/driverhomepage \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response (Success):**
```json
{
  "driverName": "John Doe",
  "driverId": 123,
  "todayRideNo": 0,
  "todayEarnings": 0
}
```

**Expected Response (Error - No Profile):**
```json
{
  "error": "Driver profile not found. Please complete your profile."
}
```

### Test Accepted Ride API
```bash
curl -X GET http://localhost:8080/api/driver/accepted \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response (No Ride):**
```json
{
  "message": "No accepted ride found"
}
```

---

## 📋 Quick Checklist

1. [ ] Check backend console for stack trace
2. [ ] Identify the exact line causing the crash
3. [ ] Check if driver has DriverProfile in database
4. [ ] Add null checks to both endpoints
5. [ ] Create DriverProfile if missing
6. [ ] Restart backend
7. [ ] Test with Postman/curl
8. [ ] Test with frontend

---

## 🎯 Most Common Issues

### Issue 1: Driver Has No Profile
**Symptom:** NullPointerException  
**Fix:** Create DriverProfile record or add null check

### Issue 2: Database Not Running
**Symptom:** Connection refused  
**Fix:** Start MySQL/PostgreSQL

### Issue 3: Wrong Database Credentials
**Symptom:** Access denied  
**Fix:** Check `application.properties`

### Issue 4: Missing Table/Column
**Symptom:** SQL syntax error  
**Fix:** Run migrations or create tables

---

## 🔍 Enable Debug Logging

**File:** `application.properties`

```properties
# Enable SQL logging
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Enable Spring logging
logging.level.org.springframework.web=DEBUG
logging.level.com.secBackend.cab_backend=DEBUG
```

---

## 💡 Quick Test Script

Create this file to test your backend:

**File:** `test-driver-api.sh`

```bash
#!/bin/bash

# Replace with your actual JWT token
TOKEN="YOUR_JWT_TOKEN_HERE"

echo "Testing Homepage API..."
curl -X GET http://localhost:8080/api/driver/driverhomepage \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nStatus: %{http_code}\n"

echo "\n\nTesting Accepted Ride API..."
curl -X GET http://localhost:8080/api/driver/accepted \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nStatus: %{http_code}\n"
```

Run: `bash test-driver-api.sh`

---

## 📞 Next Steps

1. **Check backend console** - Look for the exact error
2. **Copy the stack trace** - Share it if you need help
3. **Check database** - Verify driver has profile
4. **Add null checks** - Prevent crashes
5. **Test again** - Use Postman first, then frontend

---

**The frontend is working correctly!** The issue is 100% in the backend crashing when processing the request.
