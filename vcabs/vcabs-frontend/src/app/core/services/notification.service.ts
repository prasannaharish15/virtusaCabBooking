import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface NotificationMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<NotificationMessage>();
  public notification$: Observable<NotificationMessage> = this.notificationSubject.asObservable();

  /**
   * Show success notification
   */
  success(message: string, duration: number = 3000): void {
    this.show({ type: 'success', message, duration });
  }

  /**
   * Show error notification
   */
  error(message: string, duration: number = 5000): void {
    this.show({ type: 'error', message, duration });
  }

  /**
   * Show warning notification
   */
  warning(message: string, duration: number = 4000): void {
    this.show({ type: 'warning', message, duration });
  }

  /**
   * Show info notification
   */
  info(message: string, duration: number = 3000): void {
    this.show({ type: 'info', message, duration });
  }

  /**
   * Show notification with custom configuration
   */
  private show(notification: NotificationMessage): void {
    this.notificationSubject.next(notification);
  }

  /**
   * Parse error and extract user-friendly message
   */
  handleError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    // Check for common error structures
    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.status === 0) {
      return 'Unable to connect to server. Please check your internet connection.';
    }

    if (error?.status === 401) {
      return 'Your session has expired. Please login again.';
    }

    if (error?.status === 403) {
      return 'You do not have permission to perform this action.';
    }

    if (error?.status === 404) {
      return 'The requested resource was not found.';
    }

    if (error?.status === 500) {
      return 'Server error. Please try again later.';
    }

    return 'An unexpected error occurred. Please try again.';
  }
}
