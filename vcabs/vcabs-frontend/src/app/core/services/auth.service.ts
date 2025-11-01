import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  user?: any;
}

export interface User {
  email: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  
  // BehaviorSubject for reactive authentication state
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // BehaviorSubject for authentication status
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Login user
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  /**
   * Register new user
   */
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  /**
   * Logout user
   */
  logout(): void {
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('vcabs_active_ride'); // Clear active ride on logout

    // Update subjects
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Navigate to login
    this.router.navigate(['/login']);
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    // Store auth data
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('userEmail', response.email);
    localStorage.setItem('userRole', response.role);

    // Update current user
    const user: User = {
      email: response.email,
      role: response.role,
      token: response.token
    };

    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Get current user value
   */
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get user role
   */
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole?.toUpperCase() === role.toUpperCase();
  }

  /**
   * Navigate based on user role
   */
  navigateByRole(): void {
    const role = this.getUserRole();
    if (!role) {
      this.router.navigate(['/login']);
      return;
    }

    switch (role.toUpperCase()) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'DRIVER':
        this.router.navigate(['/driver/dashboard']);
        break;
      case 'CUSTOMER':
        this.router.navigate(['/passenger/dashboard']);
        break;
      default:
        console.warn(`Unknown role: ${role}, redirecting to login`);
        this.router.navigate(['/login']);
    }
  }

  /**
   * Check if token exists and is valid
   */
  private hasValidToken(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get user from local storage
   */
  private getUserFromStorage(): User | null {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');

    if (token && email && role) {
      return { token, email, role };
    }

    return null;
  }

  /**
   * Refresh token (if backend supports it)
   */
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh-token`, {})
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }
}
