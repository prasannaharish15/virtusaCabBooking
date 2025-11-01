import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';
      
      // Handle different error types
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Backend returned an unsuccessful response code
        switch (error.status) {
          case 0:
            errorMessage = 'Unable to connect to server. Please check your connection.';
            break;
          case 400:
            errorMessage = error.error?.message || 'Bad request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Your session has expired. Please login again.';
            // Clear auth data and redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = error.error?.message || 'Access forbidden. You don\'t have permission.';
            break;
          case 404:
            errorMessage = error.error?.message || 'Resource not found.';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflict. This resource already exists.';
            break;
          case 422:
            errorMessage = error.error?.message || 'Validation failed. Please check your input.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 502:
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            break;
          case 504:
            errorMessage = 'Request timeout. Please try again.';
            break;
          default:
            errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
        }
      }

      // Show notification for non-401 errors (401 is handled by redirect)
      if (error.status !== 401) {
        notificationService.error(errorMessage);
      }

      // Log error to console for debugging
      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        error: error
      });

      // Return error for component-level handling if needed
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error
      }));
    })
  );
};
