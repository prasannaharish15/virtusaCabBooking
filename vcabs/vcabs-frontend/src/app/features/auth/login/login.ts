import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // Getter methods for easy access to form fields
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe'); }

  // Check if field has error and is touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Get specific error message for field
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Validate form
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      this.notificationService.warning('Please fill all required fields correctly');
      return;
    }

    this.isLoading = true;

    const email = this.email?.value;
    const password = this.password?.value;

    this.authService.login(email, password)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          // Store remember me preference
          if (this.rememberMe?.value) {
            localStorage.setItem('rememberMe', 'true');
          }

          this.notificationService.success('Login successful! Redirecting...');
          
          // Navigate based on user role
          setTimeout(() => {
            this.authService.navigateByRole();
          }, 1000);
        },
        error: (error) => {
          // Error is already handled by interceptor
          // Additional component-specific error handling can go here if needed
          console.error('Login error:', error);
        }
      });
  }


  onForgotPassword(): void {
    // Navigate to forgot password page
    this.router.navigate(['/auth/forgot-password']);
  }
}

