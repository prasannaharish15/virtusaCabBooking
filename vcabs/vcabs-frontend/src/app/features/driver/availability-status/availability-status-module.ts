import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityToggleComponent } from './availability-toggle/availability-toggle';
import { BreakModeComponent } from './break-mode/break-mode';
import {  StatusSummaryComponent } from './status-summary/status-summary';
import { StatusAlerts } from './status-alerts/status-alerts';

@NgModule({
  
  imports: [CommonModule,
    AvailabilityToggleComponent,
    BreakModeComponent,
    StatusSummaryComponent,
    StatusAlerts
  ],
  exports: [
    AvailabilityToggleComponent,
    BreakModeComponent,
    StatusSummaryComponent,
    StatusAlerts
  ],
  
})
export class AvailabilityStatusModule {}
