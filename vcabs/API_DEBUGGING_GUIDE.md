# API Debugging Guide - Driver Module

## 🔍 Common Issues After Removing Mock Data

### Issue 1: "APIs not working properly"

**Possible Causes:**
1. **Authentication Token Missing** - Driver not logged in
2. **CORS Issues** - Backend not allowing frontend requests
3. **Backend Not Running** - Spring Boot server offline
4. **Wrong API URLs** - Endpoints don't match backend
5. **Empty Response** - No data in database

---

## ✅ Quick Checks

### 1. **Is Backend Running?**
```bash
# Check if Spring Boot is running on port 8080
curl http://localhost:8080/api/driver/driverhomepage
```

**Expected:** Should return 401 Unauthorized (needs auth) or data
**Problem:** Connection refused = Backend not running

---

### 2. **Is Driver Logged In?**
Open browser console (F12) and check:
```javascript
localStorage.getItem('token')
```

**Expected:** Should return a JWT token string
**Problem:** `null` = Driver not logged in

---

### 3. **Check Network Tab**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload dashboard
4. Look for requests to `/api/driver/`

**Check for:**
- ❌ **Red/Failed requests** = API error
- ✅ **Green/200 OK** = Working
- ⚠️ **401 Unauthorized** = Auth token missing/invalid
- ⚠️ **404 Not Found** = Wrong endpoint
- ⚠️ **500 Server Error** = Backend crash

---

## 🐛 Debugging Steps

### Step 1: Check Browser Console
```
F12 → Console Tab
```

Look for errors like:
- `Error loading dashboard data`
- `No accepted rides`
- `Failed to reject ride`
- `CORS error`
- `401 Unauthorized`

---

### Step 2: Test Backend Directly

**Test Homepage API:**
```bash
# Get your token from localStorage first
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:8080/api/driver/driverhomepage
```

**Expected Response:**
```json
{
  "driverName": "John Doe",
  "driverId": 123,
  "todayRideNo": 5,
  "todayEarnings": 500
}
```

**Test Accepted Rides:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:8080/api/driver/accepted
```

**Expected Response (if ride exists):**
```json
{
  "ride": {
    "rideId": 1,
    "customerName": "Jane Smith",
    "pickUpLocation": "Location A",
    "destinationLocation": "Location B",
    "fare": 200,
    ...
  }
}
```

**Expected Response (if no ride):**
```json
{
  "message": "No accepted ride found"
}
```

---

### Step 3: Check HTTP Interceptor

The frontend should automatically add the auth token. Check if interceptor is configured:

**File:** `src/app/core/interceptors/auth.interceptor.ts`

Should add header:
```typescript
Authorization: Bearer <token>
```

---

## 🔧 Common Fixes

### Fix 1: Driver Not Logged In
**Solution:** Login as driver first
1. Go to `/login`
2. Login with driver credentials
3. Token will be saved to localStorage
4. Navigate to `/driver/dashboard`

---

### Fix 2: Backend Not Running
**Solution:** Start Spring Boot backend
```bash
cd cab-backend
./mvnw spring-boot:run
```

Or in IDE: Run `CabBackendApplication.java`

---

### Fix 3: CORS Error
**Solution:** Check backend CORS configuration

**File:** `SecurityConfiguration.java`

Should allow:
```java
.cors(cors -> cors.configurationSource(request -> {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:4200"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    return config;
}))
```

---

### Fix 4: No Data in Database
**Solution:** Create test data

**Option A:** Use backend to create rides
**Option B:** Insert directly into database
**Option C:** Use passenger module to book a ride

---

### Fix 5: Token Expired
**Solution:** Login again
1. Logout
2. Login again
3. New token will be generated

---

## 📊 Expected API Flow

### Dashboard Load:
```
1. User navigates to /driver/dashboard
   ↓
2. ngOnInit() calls loadDashboardData()
   ↓
3. GET /api/driver/driverhomepage
   ↓
4. Response: { driverName, driverId, todayRideNo, todayEarnings }
   ↓
5. Update stats.today.rides and stats.today.earnings
   ↓
6. Call loadAcceptedRides()
   ↓
7. GET /api/driver/accepted
   ↓
8. Response: { ride: {...} } or { message: "No accepted ride found" }
   ↓
9. Display ride if exists
```

---

## 🧪 Test Scenarios

### Scenario 1: Fresh Driver (No Rides)
**Expected:**
- Dashboard shows: 0 rides, ₹0 earnings
- No incoming ride request
- No pending notifications

### Scenario 2: Driver with Accepted Ride
**Expected:**
- Dashboard shows accepted ride in "Incoming Request" section
- Can click "Accept" to go to ride tracking
- Can click "Reject" to cancel ride

### Scenario 3: Driver with Completed Rides
**Expected:**
- Dashboard shows: X rides, ₹Y earnings (from today)
- Earnings page shows ride history

---

## 🚨 Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Error loading dashboard data` | API call failed | Check backend running, check auth token |
| `No accepted rides` | 404 from /accepted | Normal - no rides assigned yet |
| `Failed to reject ride` | Cancel API failed | Check ride exists, check auth |
| `Invalid JWT signature` | Token corrupted | Login again |
| `CORS error` | Backend blocking request | Fix CORS config |
| `Connection refused` | Backend offline | Start backend |

---

## 📝 Checklist for "APIs Not Working"

- [ ] Backend is running on port 8080
- [ ] Driver is logged in (token in localStorage)
- [ ] Browser console shows no errors
- [ ] Network tab shows requests to /api/driver/*
- [ ] Requests return 200 OK (or 404 for no rides)
- [ ] No CORS errors
- [ ] Auth token is being sent in headers
- [ ] Backend logs show incoming requests

---

## 🔍 Debug Mode

Add console logs to see what's happening:

**In dashboard.ts:**
```typescript
loadDashboardData(): void {
  console.log('🔄 Loading dashboard data...');
  this.driverService.getDriverHomepage().subscribe({
    next: (data) => {
      console.log('✅ Dashboard data loaded:', data);
      this.homepageData = data;
      // ...
    },
    error: (err) => {
      console.error('❌ Error loading dashboard:', err);
      console.error('Status:', err.status);
      console.error('Message:', err.message);
    }
  });
}
```

---

## 💡 Quick Test

**Open browser console and run:**
```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'));

// Test API manually
fetch('http://localhost:8080/api/driver/driverhomepage', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err));
```

---

**Last Updated:** November 2, 2024  
**Status:** Debugging Guide for API Integration Issues
