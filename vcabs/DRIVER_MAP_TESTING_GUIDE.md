# Driver Map Testing Guide

## Quick Test Steps

### 1. Start the Application
```bash
cd vcabs-frontend
npm start
```

### 2. Login as Driver
- Navigate to driver login
- Use valid driver credentials
- Should redirect to driver dashboard

### 3. Navigate to Ride Requests
- Click on "Ride Requests" from dashboard
- Should see any accepted/assigned rides
- If no rides, backend should auto-assign rides to available drivers

### 4. Accept/View Ride
- Click "Accept" or "View Details" on a ride request
- Should navigate to `/driver/ride-tracking/:rideId`

### 5. Verify Map Display
**Expected Behavior:**
- ✅ Map should be visible immediately
- ✅ Map tiles should load (OpenStreetMap)
- ✅ Green marker at pickup location
- ✅ Red marker at dropoff location
- ✅ Purple dashed line connecting pickup and dropoff
- ✅ Map should auto-zoom to fit all markers

### 6. Check Console Logs
Open browser DevTools (F12) and check console for:
```
🗺️ Ride Tracking Component Initialized
🎯 Ride ID from route: [number]
📊 Loading ride details for ID: [number]
✅ Ride details response: [object]
✅ Ride loaded: [object]
🔍 ngAfterViewInit called - Initializing map
🗺️ Initializing Leaflet map... {elementWidth: X, elementHeight: Y}
✅ Map initialized successfully
🔄 Map size invalidated (100ms)
🔄 Map size invalidated (300ms)
🔄 Map size invalidated (500ms)
✅ Updating map with ride data now...
🗺️ Updating map with ride data: {pickUpLat: X, pickUpLng: Y, ...}
🔄 Map size invalidated (immediate)
🔄 Map size invalidated (200ms)
🔄 Map size invalidated (400ms)
✅ Map updated with ride data
📍 Starting location tracking...
```

### 7. Test Driver Location Tracking
- Allow browser location permissions when prompted
- Blue marker should appear at your current location
- Marker should update every 5 seconds

### 8. Test Ride Actions

#### Start Ride (if status is ACCEPTED):
1. Enter OTP in the input field
2. Click "Start Ride"
3. Should show success message
4. Status should change to IN_PROGRESS

#### Complete Ride (if status is IN_PROGRESS):
1. Click "Complete Ride"
2. Confirm the action
3. Should navigate to earnings page

## Common Issues & Solutions

### Issue 1: Map Not Visible
**Symptoms:**
- Gray box where map should be
- No tiles loading

**Solutions:**
1. Check browser console for errors
2. Verify element dimensions: `document.getElementById('map').offsetHeight`
3. Check if Leaflet CSS is loaded: Look for `.leaflet-container` styles in DevTools
4. Clear browser cache and reload

### Issue 2: Map Tiles Not Loading
**Symptoms:**
- Map container visible but no tiles
- Console shows tile loading errors

**Solutions:**
1. Check internet connection
2. Verify OpenStreetMap is accessible
3. Check for CORS issues in console
4. Try alternative tile provider

### Issue 3: Markers Not Showing
**Symptoms:**
- Map loads but no markers visible

**Solutions:**
1. Check ride data has valid coordinates
2. Verify marker icon URLs are accessible
3. Check console for marker creation errors
4. Verify ride data structure matches `RideResponseDto`

### Issue 4: Map Size Issues
**Symptoms:**
- Map appears but is tiny or incorrectly sized
- Tiles appear but don't fill container

**Solutions:**
1. Check CSS for `.map-wrapper` has `height: 500px`
2. Verify no conflicting CSS
3. Check if `invalidateSize()` is being called
4. Inspect element to verify dimensions

## Browser DevTools Inspection

### Check Map Container Dimensions
```javascript
const mapEl = document.getElementById('map');
console.log({
  width: mapEl.offsetWidth,
  height: mapEl.offsetHeight,
  display: window.getComputedStyle(mapEl).display,
  position: window.getComputedStyle(mapEl).position
});
```

### Check Leaflet Map Instance
```javascript
// In browser console after map loads
// The map instance should be accessible via the component
// Check if tiles are loaded
document.querySelectorAll('.leaflet-tile').length // Should be > 0
```

### Check Markers
```javascript
// Count markers on map
document.querySelectorAll('.leaflet-marker-icon').length // Should be 2-3
```

## Expected API Responses

### Get Accepted Rides Response
```json
{
  "ride": {
    "rideId": 123,
    "customerName": "John Doe",
    "customerPhoneNumber": "1234567890",
    "pickUpLocation": "Address 1",
    "destinationLocation": "Address 2",
    "pickUpLatitude": 12.9716,
    "pickUpLongitude": 77.5946,
    "dropOffLatitude": 12.2958,
    "dropOffLongitude": 76.6394,
    "distance": 25.5,
    "durationMinutes": 45,
    "fare": 450,
    "status": "ACCEPTED"
  }
}
```

## Performance Checks

1. **Map Load Time**: Should load within 1-2 seconds
2. **Tile Loading**: Tiles should appear progressively
3. **Location Updates**: Should update smoothly every 5 seconds
4. **No Memory Leaks**: Check DevTools Memory tab after multiple navigations

## Mobile Testing

1. Test on mobile viewport (DevTools responsive mode)
2. Verify map is responsive
3. Check touch interactions (zoom, pan)
4. Verify location permissions work on mobile

## Accessibility Testing

1. Check keyboard navigation
2. Verify screen reader compatibility
3. Test with high contrast mode
4. Verify color-blind friendly markers

## Success Criteria

✅ Map loads and displays correctly  
✅ All markers appear at correct locations  
✅ Route line connects pickup and dropoff  
✅ Driver location updates in real-time  
✅ No console errors  
✅ Map is interactive (zoom, pan)  
✅ Responsive on all screen sizes  
✅ Works on different browsers (Chrome, Firefox, Safari, Edge)  

## Rollback Plan

If issues persist, revert changes:
```bash
git checkout HEAD -- vcabs-frontend/src/app/features/driver/ride-tracking/
```

Then investigate further with original implementation.
