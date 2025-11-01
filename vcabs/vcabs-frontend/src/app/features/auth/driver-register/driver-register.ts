import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'vcabs-driver-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './driver-register.html',
  styleUrls: ['./driver-register.css']
})
export class DriverRegister {
  form: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      vehicleNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]{6,10}$/)]],
      licenseNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/auth/login']);
    }, 2000);
  }
}
