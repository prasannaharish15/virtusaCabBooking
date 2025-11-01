import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { IntercityBookingComponent } from './booking/intercity-booking/intercity-booking.component';
import { RentalBookingComponent } from './booking/rental-booking/rental-booking.component';
import { ReserveBookingComponent } from './booking/reserve-booking/reserve-booking.component';
import { TripBookingComponent } from './booking/trip-booking/trip-booking.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'booking/intercity', component: IntercityBookingComponent},
  {path: 'booking/rental', component: RentalBookingComponent},
  {path: 'booking/reserve', component: ReserveBookingComponent},
  {path: 'booking/trip', component: TripBookingComponent},
  {path: 'booking-details/:id', component: BookingDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassengerRoutingModule { }

