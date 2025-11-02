# Quick Reference - Driver Polling System

## 🚀 Quick Start

### 1. Use Polling Service in Any Component

```typescript
import { DriverRidePollingService, RideState } from '@core/services/driver-ride-polling.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  rideState: RideState | null = null;

  constructor(
    private pollingService: DriverRidePollingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Subscribe to updates
    this.pollingService.getRideState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.rideState = state;
        this.cdr.markForCheck();
      });
    
    // Start polling (only once in app)
    this.pollingService.startPolling();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## 📡 API Endpoints

### Homepage Data
```
GET /api/driver/driverhomepage
Headers: Authorization: Bearer <token>
Response: { driverName, driverId, todayRideNo, todayEarnings }
```

### Accepted Ride
```
GET /api/driver/accepted
Headers: Authorization: Bearer <token>
Response: { ride: {...} } or 404
```

---

## ⚙️ Configuration

### Change Polling Interval
```typescript
// driver-ride-polling.service.ts
private readonly POLL_INTERVAL_MS = 10000; // milliseconds
```

### Change Retry Settings
```typescript
private readonly MAX_RETRY_ATTEMPTS = 3;
private readonly RETRY_DELAY_MS = 2000;
```

---

## 🧪 Testing

### Unit Test
```typescript
it('should poll every 10 seconds', fakeAsync(() => {
  service.startPolling();
  tick(10000);
  expect(httpMock.expectOne('/api/driver/driverhomepage')).toBeTruthy();
}));
```

### Manual Test
1. Open `/driver/dashboard`
2. Open browser console (F12)
3. Look for: `🔄 Loading accepted rides...`
4. Should see updates every 10 seconds

---

## 🐛 Debugging

### Check Polling Status
```javascript
// Browser console
const service = ng.probe(document.body).injector.get(DriverRidePollingService);
console.log(service.getCurrentState());
```

### Common Issues

**UI not updating?**
```typescript
// Add this after state update
this.cdr.markForCheck();
```

**Memory leak?**
```typescript
// Ensure ngOnDestroy is implemented
ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

**Too many API calls?**
```typescript
// Increase interval
private readonly POLL_INTERVAL_MS = 30000; // 30 seconds
```

---

## 📊 Performance

**Current Load:**
- 2 API calls / 10 seconds
- 12 requests / minute
- 720 requests / hour

**Optimization:**
- Use OnPush change detection
- Add backend caching (Redis)
- Increase polling interval for production

---

## 🔗 Documentation

- **Full Guide:** `POLLING_MIGRATION_GUIDE.md`
- **API Docs:** `BACKEND_API_ANALYSIS.md`
- **Complete Solution:** `COMPLETE_POLLING_SOLUTION.md`

---

## 💡 Tips

1. **Only start polling once** (in dashboard/main component)
2. **Other components just subscribe** to `getRideState$()`
3. **Always use takeUntil** for subscriptions
4. **Always call markForCheck** with OnPush
5. **Check console logs** for debugging

---

**Need Help?** Check the full documentation or contact the dev team.
