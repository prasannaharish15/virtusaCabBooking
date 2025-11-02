import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { 
  BehaviorSubject, 
  Observable, 
  timer, 
  EMPTY,
  throwError,
  Subject
} from 'rxjs';
import { 
  switchMap, 
  catchError, 
  retry, 
  tap,
  takeUntil,
  distinctUntilChanged,
  shareReplay
} from 'rxjs/operators';

// ============ INTERFACES (Match Backend DTOs EXACTLY) ============

export interface DriverHomePageDto {
  driverName: string;
  driverId: number;
  todayRideNo: number;
  todayEarnings: number;
}

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

export interface AcceptedRideResponse {
  ride: RideResponseDto;
}

export interface RideState {
  acceptedRide: RideResponseDto | null;
  homepageData: DriverHomePageDto | null;
  lastUpdated: Date;
  isPolling: boolean;
  error: string | null;
}

// ============ POLLING SERVICE ============

@Injectable({
  providedIn: 'root'
})
export class DriverRidePollingService implements OnDestroy {
  private readonly API_URL = 'http://localhost:8080/api/driver';
  private readonly POLL_INTERVAL_MS = 10000; // 10 seconds
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY_MS = 2000; // 2 seconds between retries

  // State management
  private rideState$ = new BehaviorSubject<RideState>({
    acceptedRide: null,
    homepageData: null,
    lastUpdated: new Date(),
    isPolling: false,
    error: null
  });

  // Polling control
  private destroy$ = new Subject<void>();
  private pollingActive = false;
  private errorCount = 0;
  private backoffDelay = this.RETRY_DELAY_MS;

  constructor(private http: HttpClient) {
    console.log('🚀 DriverRidePollingService initialized');
  }

  // ============ PUBLIC API ============

  /**
   * Get observable of current ride state
   * Components subscribe to this to get real-time updates
   */
  getRideState$(): Observable<RideState> {
    return this.rideState$.asObservable().pipe(
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev.acceptedRide) === JSON.stringify(curr.acceptedRide) &&
        JSON.stringify(prev.homepageData) === JSON.stringify(curr.homepageData)
      ),
      shareReplay(1)
    );
  }

  /**
   * Get current state snapshot (synchronous)
   */
  getCurrentState(): RideState {
    return this.rideState$.value;
  }

  /**
   * Start polling for ride updates
   * Automatically polls every 10 seconds
   */
  startPolling(): void {
    if (this.pollingActive) {
      console.log('⚠️ Polling already active');
      return;
    }

    console.log('▶️ Starting ride polling (every 10s)');
    this.pollingActive = true;
    this.updateState({ isPolling: true, error: null });

    // Initial fetch
    this.fetchAllData();

    // Set up polling with timer
    timer(this.POLL_INTERVAL_MS, this.POLL_INTERVAL_MS)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.fetchAllData())
      )
      .subscribe({
        error: (err) => {
          console.error('❌ Polling error:', err);
          this.handlePollingError(err);
        }
      });
  }

  /**
   * Stop polling
   */
  stopPolling(): void {
    if (!this.pollingActive) return;
    
    console.log('⏹️ Stopping ride polling');
    this.pollingActive = false;
    this.updateState({ isPolling: false });
    this.destroy$.next();
  }

  /**
   * Force immediate refresh
   */
  refresh(): Observable<RideState> {
    console.log('🔄 Manual refresh triggered');
    return this.fetchAllData().pipe(
      switchMap(() => this.getRideState$())
    );
  }

  // ============ PRIVATE METHODS ============

  /**
   * Fetch both homepage data and accepted ride
   */
  private fetchAllData(): Observable<void> {
    return new Observable(observer => {
      // Fetch both endpoints in parallel
      Promise.all([
        this.fetchHomepageData().toPromise(),
        this.fetchAcceptedRide().toPromise()
      ])
      .then(([homepage, acceptedRide]) => {
        this.updateState({
          homepageData: homepage,
          acceptedRide: acceptedRide,
          lastUpdated: new Date(),
          error: null
        });
        this.resetErrorTracking();
        observer.next();
        observer.complete();
      })
      .catch(error => {
        console.error('❌ Error fetching data:', error);
        this.updateState({ error: error.message || 'Failed to fetch data' });
        observer.error(error);
      });
    });
  }

  /**
   * Fetch homepage data from backend
   * GET /api/driver/driverhomepage
   */
  private fetchHomepageData(): Observable<DriverHomePageDto> {
    return this.http.get<DriverHomePageDto>(`${this.API_URL}/driverhomepage`).pipe(
      tap(data => console.log('✅ Homepage data:', data)),
      retry({
        count: this.MAX_RETRY_ATTEMPTS,
        delay: this.RETRY_DELAY_MS
      }),
      catchError(this.handleError('fetchHomepageData'))
    );
  }

  /**
   * Fetch accepted ride from backend
   * GET /api/driver/accepted
   * Returns null if 404 (no accepted ride - this is NORMAL)
   */
  private fetchAcceptedRide(): Observable<RideResponseDto | null> {
    return this.http.get<AcceptedRideResponse>(`${this.API_URL}/accepted`).pipe(
      tap(response => console.log('✅ Accepted ride response:', response)),
      switchMap(response => {
        if (response && response.ride) {
          return [response.ride];
        }
        return [null];
      }),
      catchError((error: HttpErrorResponse) => {
        // 404 is normal - means no accepted ride
        if (error.status === 404) {
          console.log('ℹ️ No accepted ride (404 - normal)');
          return [null];
        }
        // Other errors are real problems
        return this.handleError('fetchAcceptedRide')(error);
      })
    );
  }

  /**
   * Update state immutably
   */
  private updateState(partial: Partial<RideState>): void {
    const currentState = this.rideState$.value;
    this.rideState$.next({
      ...currentState,
      ...partial
    });
  }

  /**
   * Handle polling errors with exponential backoff
   */
  private handlePollingError(error: any): void {
    this.errorCount++;
    
    if (this.errorCount >= 5) {
      console.error('❌ Too many errors, stopping polling');
      this.stopPolling();
      this.updateState({ 
        error: 'Polling stopped due to repeated errors. Please refresh the page.',
        isPolling: false
      });
      return;
    }

    // Exponential backoff
    this.backoffDelay = Math.min(this.backoffDelay * 2, 60000); // Max 60 seconds
    console.warn(`⚠️ Error ${this.errorCount}/5, backing off ${this.backoffDelay}ms`);
  }

  /**
   * Reset error tracking on successful fetch
   */
  private resetErrorTracking(): void {
    if (this.errorCount > 0) {
      console.log('✅ Connection restored');
    }
    this.errorCount = 0;
    this.backoffDelay = this.RETRY_DELAY_MS;
  }

  /**
   * Generic error handler
   */
  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<any> => {
      console.error(`❌ ${operation} failed:`, error);
      
      // Log detailed error info
      if (error.error instanceof ErrorEvent) {
        console.error('Client-side error:', error.error.message);
      } else {
        console.error(`Server error: ${error.status} ${error.statusText}`);
        console.error('Response body:', error.error);
      }

      // Return empty result so polling continues
      return EMPTY;
    };
  }

  /**
   * Cleanup on service destroy
   */
  ngOnDestroy(): void {
    console.log('🛑 DriverRidePollingService destroyed');
    this.stopPolling();
    this.rideState$.complete();
  }
}
