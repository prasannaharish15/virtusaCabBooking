import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { ActiveRides } from './active-rides/active-rides';
import { CompletedRides } from './completed-rides/completed-rides';
import { Customers } from './customers/customers';
import { Revenue } from './revenue/revenue';
import { Auditlog } from './audit-log/auditlog';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    Dashboard,
    ActiveRides,
    CompletedRides,
    Customers,
  Revenue,
  Auditlog
  ]
})
export class AdminModule { }
