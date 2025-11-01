import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type PaymentMode = 'Cash' | 'UPI' | 'Card' | 'Wallet';

export interface DriverRide {
  id: string;
  passengerName: string;
  pickupLocation: string;
  dropLocation: string;
  // fare is fixed at acceptance time
  fare: number;
  startedAt?: Date;
  completedAt?: Date;
  paymentMode?: PaymentMode;
}

export interface EarningItem {
  id: string;
  date: Date;
  amount: number;
  paymentMode: PaymentMode;
  passengerName: string;
  pickupLocation: string;
  dropLocation: string;
}

export interface DriverStats {
  today: {
    rides: number;
    earnings: number;
  };
}

@Injectable({ providedIn: 'root' })
export class DriverRidesStore {
  private readonly ongoing$ = new BehaviorSubject<DriverRide[]>([]);
  private readonly completed$ = new BehaviorSubject<DriverRide[]>([]);
  private readonly earnings$ = new BehaviorSubject<EarningItem[]>([]);
  private readonly stats$ = new BehaviorSubject<DriverStats>({ today: { rides: 0, earnings: 0 } });

  private storageKey = 'driver-store';

  constructor() {
    this.loadFromStorage();
  }

  // Observables
  observeOngoing() { return this.ongoing$.asObservable(); }
  observeCompleted() { return this.completed$.asObservable(); }
  observeEarnings() { return this.earnings$.asObservable(); }
  observeStats() { return this.stats$.asObservable(); }

  // Snapshots
  getOngoing() { return this.ongoing$.getValue(); }
  getCompleted() { return this.completed$.getValue(); }
  getEarnings() { return this.earnings$.getValue(); }
  getStats() { return this.stats$.getValue(); }

  // Mutations
  // Accept a ride with a fixed fare; not started until OTP on Tracking
  acceptRide(ride: { id: string; passengerName: string; pickupLocation: string; dropLocation: string; fare: number; }) {
    const item: DriverRide = { ...ride } as DriverRide;
    this.ongoing$.next([ ...this.getOngoing(), item ]);
    this.saveToStorage();
  }

  // Start ride by OTP confirmation
  startRideById(rideId: string) {
    const ongoing = this.getOngoing();
    const idx = ongoing.findIndex(r => r.id === rideId);
    if (idx === -1) return;
    const updated = { ...ongoing[idx], startedAt: new Date() } as DriverRide;
    const next = [ ...ongoing ];
    next[idx] = updated;
    this.ongoing$.next(next);
    this.saveToStorage();
  }

  completeRide(rideId: string, paymentMode: PaymentMode) {
    const ongoing = this.getOngoing();
    const idx = ongoing.findIndex(r => r.id === rideId);
    if (idx === -1) return;
    const ride = { ...ongoing[idx], completedAt: new Date(), paymentMode } as DriverRide;
    const nextOngoing = [ ...ongoing.slice(0, idx), ...ongoing.slice(idx + 1) ];
    this.ongoing$.next(nextOngoing);

    this.completed$.next([ ride, ...this.getCompleted() ]);

    // Update stats
    const stats = this.getStats();
    const nextStats: DriverStats = {
      today: {
        rides: stats.today.rides + 1,
        earnings: stats.today.earnings + (ride.fare || 0)
      }
    };
    this.stats$.next(nextStats);

    // Add earning item
    const earning: EarningItem = {
      id: ride.id,
      date: ride.completedAt!,
      amount: ride.fare || 0,
      paymentMode,
      passengerName: ride.passengerName,
      pickupLocation: ride.pickupLocation,
      dropLocation: ride.dropLocation,
    };
    this.earnings$.next([ earning, ...this.getEarnings() ]);
    this.saveToStorage();
  }

  // Initialize entire state (used by seed service)
  setState(state: { stats?: DriverStats; earnings?: EarningItem[]; completed?: DriverRide[]; ongoing?: DriverRide[]; }) {
    if (state.ongoing) this.ongoing$.next([ ...state.ongoing ]);
    if (state.completed) this.completed$.next([ ...state.completed ]);
    if (state.earnings) this.earnings$.next([ ...state.earnings ]);
    if (state.stats) this.stats$.next({ ...state.stats });
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      const data = {
        stats: this.getStats(),
        earnings: this.getEarnings(),
        completed: this.getCompleted(),
        ongoing: this.getOngoing(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch {}
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.stats) this.stats$.next(data.stats);
      if (data.earnings) this.earnings$.next(data.earnings);
      if (data.completed) this.completed$.next(data.completed);
      if (data.ongoing) this.ongoing$.next(data.ongoing);
    } catch {}
  }
}
