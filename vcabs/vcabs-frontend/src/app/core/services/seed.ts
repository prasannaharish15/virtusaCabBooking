import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DriverRidesStore, DriverRide, EarningItem, DriverStats } from '../../features/driver/shared/driver-rides.store';
import { DriverRequestsStore, DriverRideRequest } from '../../features/driver/shared/driver-requests.store';

interface SeedShape {
  stats?: DriverStats;
  earnings?: EarningItem[];
  completed?: DriverRide[];
  ongoing?: DriverRide[];
  rideRequests?: Array<DriverRideRequest & { fare: number; distance: number; }>;
}

@Injectable({ providedIn: 'root' })
export class SeedService {
  private readonly storageKey = 'driver-store';
  private readonly seededKey = 'driver-store-seeded';

  constructor(
    private http: HttpClient,
    private ridesStore: DriverRidesStore,
    private requestsStore: DriverRequestsStore,
  ) {}

  async initIfEmpty(): Promise<void> {
    try {
      const existing = localStorage.getItem(this.storageKey);
      // If any existing state is present, do not seed (preserve user data)
      if (existing) return;

      const seed = await firstValueFrom(this.http.get<SeedShape>('assets/driver-seed.json'));
      // Populate rides store
      this.ridesStore.setState({
        stats: seed.stats || { today: { rides: 0, earnings: 0 } },
        earnings: seed.earnings || [],
        completed: seed.completed || [],
        ongoing: seed.ongoing || [],
      });
      // Populate requests store
      if (seed.rideRequests && seed.rideRequests.length) {
        const mapped: DriverRideRequest[] = seed.rideRequests.map(r => ({
          id: r.id,
          passengerName: r.passengerName,
          pickupLocation: r.pickupLocation,
          dropLocation: r.dropLocation,
          requestedAt: typeof (r as any).requestedAt === 'string' ? (r as any).requestedAt : new Date(),
          distance: (r as any).distance,
          fare: (r as any).fare,
        }));
        this.requestsStore.set(mapped);
      }
      localStorage.setItem(this.seededKey, 'true');
    } catch (e) {
      // ignore seeding errors
    }
  }
}
