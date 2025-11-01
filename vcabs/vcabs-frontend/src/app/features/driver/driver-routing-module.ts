import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { RideRequests } from './ride-requests/ride-requests';
import { RideTracking } from './ride-tracking/ride-tracking';
import { Earnings } from './earnings/earnings';
import { Profile } from './profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'ride-requests', component: RideRequests },
  { path: 'ride-tracking/:rideId', component: RideTracking },
  { path: 'earnings', component: Earnings },
  { path: 'profile', component: Profile },
];
export class DriverRoutingModule {}
