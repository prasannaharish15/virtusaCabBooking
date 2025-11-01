import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DriverRideRequest {
  id: string;
  passengerName: string;
  pickupLocation: string;
  dropLocation: string;
  fare?: number;
  distance?: number;
  requestedAt: Date | string;
}

@Injectable({ providedIn: 'root' })
export class DriverRequestsStore {
  private readonly requests$ = new BehaviorSubject<DriverRideRequest[]>([]);
  private storageKey = 'driver-requests';

  constructor() {
    this.loadFromStorage();
  }

  observe(): Observable<DriverRideRequest[]> {
    return this.requests$.asObservable();
  }

  getSnapshot(): DriverRideRequest[] {
    return this.requests$.getValue();
  }

  set(requests: DriverRideRequest[]): void {
    this.requests$.next([ ...requests ]);
    this.saveToStorage();
  }

  upsertMany(requests: DriverRideRequest[]): void {
    const map = new Map<string, DriverRideRequest>(this.getSnapshot().map(r => [r.id, r]));
    for (const r of requests) map.set(r.id, r);
    this.requests$.next(Array.from(map.values()));
    this.saveToStorage();
  }

  remove(id: string): void {
    const next = this.getSnapshot().filter(r => r.id !== id);
    this.requests$.next(next);
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.getSnapshot()));
    } catch {}
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data)) this.requests$.next(data);
    } catch {}
  }
}


