import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vcabs-customer-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customer-register.html',
  styleUrls: ['./customer-register.css']
})
export class CustomerRegister {
  form: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  otpSent = false;
  otpVerified = false;
  otpLoading = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    // Reset OTP state when email changes
    this.form.get('email')?.valueChanges.subscribe(() => {
      this.resetOtpState();
    });
  }

  get f() { return this.form.controls; }

  private resetOtpState() {
    this.otpSent = false;
    this.otpVerified = false;
    this.otpLoading = false;
    this.form.get('otp')?.reset();
  }

  sendOtp() {
    if (this.f['email'].invalid) {
      this.f['email'].markAsTouched();
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    // Prevent multiple clicks
    if (this.otpLoading) return;

    this.otpLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    // Reset OTP state when sending new OTP
    this.otpSent = false;
    this.otpVerified = false;
    
    this.http.post<any>(`http://localhost:8080/api/otp/generateotp/${this.f['email'].value}`, {})
      .subscribe({
        next: (res) => {
          this.otpLoading = false;
          this.otpSent = true;
          this.otpVerified = false;
          this.errorMessage = null;
          this.successMessage = res.message || 'OTP sent successfully!';
          this.form.get('otp')?.reset();
          this.cdRef.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          this.otpLoading = false;
          this.otpSent = false;
          this.otpVerified = false;
          // Try to get error message from different possible response formats
          this.errorMessage = err.error?.message || err.error?.error || err.message || 'Failed to send OTP';
          this.cdRef.detectChanges();
        }
      });
  }

  verifyOtp() {
    if (this.f['otp'].invalid) {
      this.f['otp'].markAsTouched();
      this.errorMessage = 'Please enter a valid 6-digit OTP';
      return;
    }

    // Prevent multiple clicks
    if (this.otpLoading) return;

    this.otpLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    this.http.post<any>(`http://localhost:8080/api/otp/verifyotp/${this.f['email'].value}/${this.f['otp'].value}`, {})
      .subscribe({
        next: (res) => {
          this.otpLoading = false;
          
          // Handle both boolean and message responses
          if (res === true || res.message === true) {
            this.otpVerified = true;
            this.errorMessage = null;
            this.successMessage = 'OTP verified successfully!';
          } else {
            this.otpVerified = false;
            this.errorMessage = 'Invalid OTP';
          }
          this.cdRef.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          this.otpLoading = false;
          this.otpVerified = false;
          this.errorMessage = err.error?.message || err.error?.error || err.message || 'Invalid OTP';
          this.cdRef.detectChanges();
        }
      });
  }

  submit() {
    this.form.markAllAsTouched();
    
    if (this.form.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    if (!this.otpVerified) {
      this.errorMessage = 'Please verify your OTP first';
      return;
    }

    // Prevent multiple clicks
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const payload = {
      userName: this.f['userName'].value,
      email: this.f['email'].value,
      phoneNumber: this.f['phoneNumber'].value,
      password: this.f['password'].value,
      role: 'CUSTOMER'
    };

    this.http.post<any>('http://localhost:8080/api/auth/register', payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Handle different response formats
        this.successMessage = response.body?.message || response.message || 'Registration successful';
        this.cdRef.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error?.error || err.message || 'Registration failed';
        this.cdRef.detectChanges();
      }
    });
  }
}