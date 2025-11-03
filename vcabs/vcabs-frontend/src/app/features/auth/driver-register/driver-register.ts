import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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
  successMessage: string | null = null;

  otpSent = false;
  otpVerified = false;
  otpLoading = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      vehicleNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]{6,10}$/)]],
      licenseNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]{6,15}$/)]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    // Reset OTP state when email changes
    this.form.get('email')?.valueChanges.subscribe(() => {
      this.resetOtpState();
    });
  }

  get f() {
    return this.form.controls;
  }

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
    this.otpVerified = false;
    
    this.http.post<any>(`http://localhost:8080/api/otp/generateotp/${this.f['email'].value}`, {})
      .subscribe({
        next: (res) => {
          this.ngZone.run(() => {
            this.otpLoading = false;
            this.otpSent = true;
            this.form.get('otp')?.reset();
            
            // Use Promise.resolve to push the success message to the next change detection cycle
            Promise.resolve().then(() => {
              this.successMessage = 'OTP sent successfully! Please check your email.';
              this.cdRef.detectChanges();
            });
          });
        },
        error: (err: HttpErrorResponse) => {
          this.otpLoading = false;
          this.otpSent = false;
          this.otpVerified = false;
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
          this.ngZone.run(() => {
            this.otpLoading = false;
            
            // Handle both boolean and message responses
            if (res === true || res.message === true) {
              this.otpVerified = true;
              this.errorMessage = null;
              
              // Use Promise.resolve to push the success message to the next change detection cycle
              Promise.resolve().then(() => {
                this.successMessage = 'OTP verified successfully!';
                this.cdRef.detectChanges();
              });
            } else {
              this.otpVerified = false;
              Promise.resolve().then(() => {
                this.errorMessage = 'Invalid OTP';
                this.cdRef.detectChanges();
              });
            }
          });
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
      role: 'DRIVER',
      driverDetails: {
        licenseNumber: this.f['licenseNumber'].value,
        vehicleNumber: this.f['vehicleNumber'].value,
        profilePictureData: null,
        make: null,
        model: null,
        color: null,
        licenceExpiryDate: null
      }
    };

    this.http.post<any>('http://localhost:8080/api/auth/register', payload).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          // Handle different response formats
          Promise.resolve().then(() => {
            this.successMessage = response.body?.message || response.message || 'Registration successful';
            this.cdRef.detectChanges();
          });
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        });
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error?.error || err.message || 'Registration failed';
        this.cdRef.detectChanges();
      }
    });
  }
}
