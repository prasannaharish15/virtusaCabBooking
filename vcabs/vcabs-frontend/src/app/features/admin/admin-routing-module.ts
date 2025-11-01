import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { ActiveRides } from './active-rides/active-rides';
import { CompletedRides } from './completed-rides/completed-rides';
import { Customers } from './customers/customers';
import { Revenue } from './revenue/revenue';
import { Auditlog } from './audit-log/auditlog';
import { CancelledRides } from './cancelled-rides/cancelled-rides';
import { Driver } from './driver/driver';
import { Billing } from './billing/billing';
import { Rental } from './rental/rental';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'active-rides',
    component: ActiveRides
  },
  {
    path: 'completed-rides',
    component: CompletedRides
  },
  {
    path: 'cancelled-rides',
    component: CancelledRides
  },
  {
    path: 'driver',
    component: Driver
  },
  {
    path: 'billing',
    component: Billing
  },

  {
    path: 'rental',
    component: Rental
  },
  {
    path: 'customers',
    component: Customers
  },
  {
    path: 'revenue',
    component: Revenue
  },
  {
    path: 'audit-log',
    component: Auditlog
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
