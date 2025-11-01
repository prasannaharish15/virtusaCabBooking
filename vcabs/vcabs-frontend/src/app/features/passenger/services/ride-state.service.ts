import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActiveRideState, RideResponse } from '../models/booking.model';

/**
 * RideStateService - Manages active ride state with localStorage persistence
 * 
 * Features:
 * - Stores active ride in localStorage for persistence across page refreshes
 * - Uses RxJS BehaviorSubject for reactive state updates
 * - Provides methods to set, get, and clear active ride state
 */
@Injectable({
  providedIn: 'root'
})
export class RideStateService {
  private readonly STORAGE_KEY = 'vcabs_active_ride';
  
  // BehaviorSubject to manage active ride state reactively
  private activeRideSubject = new BehaviorSubject<ActiveRideState | null>(this.loadFromStorage());
  
  // Observable that components can subscribe to
  public activeRide$: Observable<ActiveRideState | null> = this.activeRideSubject.asObservable();

  constructor() {
    console.log('🚗 RideStateService initialized');
    // Load active ride from storage on initialization
    const storedRide = this.loadFromStorage();
    if (storedRide) {
      console.log('📦 Loaded active ride from storage:', storedRide);
    }
  }

  /**
   * Set an active ride and persist to localStorage
   */
  setActiveRide(ride: RideResponse): void {
    const activeState: ActiveRideState = {
      ride: ride,
      isActive: true,
      lastUpdated: new Date()
    };
    
    console.log('✅ Setting active ride:', activeState);
    
    // Save to localStorage
    this.saveToStorage(activeState);
    
    // Emit to subscribers
    this.activeRideSubject.next(activeState);
  }

  /**
   * Update the active ride (e.g., with new driver location)
   */
  updateActiveRide(ride: RideResponse): void {
    const currentState = this.activeRideSubject.value;
    if (currentState) {
      const updatedState: ActiveRideState = {
        ...currentState,
        ride: ride,
        lastUpdated: new Date()
      };
      
      this.saveToStorage(updatedState);
      this.activeRideSubject.next(updatedState);
    }
  }

  /**
   * Get current active ride state (synchronous)
   */
  getActiveRide(): ActiveRideState | null {
    return this.activeRideSubject.value;
  }

  /**
   * Check if there is an active ride
   */
  hasActiveRide(): boolean {
    const state = this.activeRideSubject.value;
    return state !== null && state.isActive;
  }

  /**
   * Clear active ride state
   */
  clearActiveRide(): void {
    console.log('🗑️ Clearing active ride');
    localStorage.removeItem(this.STORAGE_KEY);
    this.activeRideSubject.next(null);
  }

  /**
   * Mark ride as completed/cancelled and clear
   */
  completeRide(): void {
    console.log('✅ Ride completed');
    this.clearActiveRide();
  }

  /**
   * Load active ride from localStorage
   */
  private loadFromStorage(): ActiveRideState | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert lastUpdated back to Date object
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        
        // Check if ride is still valid (not too old, not completed/cancelled)
        const hoursSinceUpdate = (Date.now() - parsed.lastUpdated.getTime()) / (1000 * 60 * 60);
        const isValidStatus = parsed.ride.status !== 'COMPLETED' && parsed.ride.status !== 'CANCELLED';
        
        if (hoursSinceUpdate < 24 && isValidStatus) {
          return parsed;
        } else {
          // Clear stale data
          console.log('🗑️ Clearing stale ride data');
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading ride from storage:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
    return null;
  }

  /**
   * Save active ride to localStorage
   */
  private saveToStorage(state: ActiveRideState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving ride to storage:', error);
    }
  }
}
