import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './login/login';
import { Register } from './register/register';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    Login
  ]
})
export class AuthModule { }
