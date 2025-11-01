import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';
import { CustomerRegister } from './customer-register/customer-register';
import { DriverRegister } from './driver-register/driver-register';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'register/customer', component: CustomerRegister },
  { path: 'register/driver', component: DriverRegister },
  { path: 'forgot-password', component: ForgotPassword }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
