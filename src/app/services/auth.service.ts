import { Injectable, PLATFORM_ID, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap, catchError, finalize, take } from 'rxjs/operators';
import { of, throwError, Observable, ReplaySubject } from 'rxjs';
import { AuthStore, AuthUser } from '../auth/auth-store'; 
import { ApiService } from './api.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse, LoginPayload, RegisterPayload } from '../auth/model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  //private apiService = inject(ApiService);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  // 1. App Initialization Stream
  private readonly _isInitialized$ = new ReplaySubject<boolean>(1);
  readonly isInitialized$ = this._isInitialized$.asObservable();

  // 2. Reactive State Selectors
  readonly isLoggedIn = computed(() => this.authStore.isLoggedIn());

  constructor(private apiService: ApiService) {
    this.initUser();
  }

  
   initUser() {
  // 1. SSR Guard: Immediate exit for server-side rendering
  if (!isPlatformBrowser(this.platformId)) {
    this._isInitialized$.next(true);
    return;
  }

  this.authStore.setLoading(true);

  this.apiService.get<AuthUser>('api/me').pipe(
    take(1), // Essential: ensures the stream closes after the first result
    tap((user) => {
      this.authStore.setUser(user);
  console.log('app initialized');
  
    }),
  catchError((error) => {
  // 1. Log the high-level error (status code, url, etc.)
  console.error('Auth initialization failed. Status:', error.status);
  console.log(this.authStore.user(),' if user is null or not');
  

  // 2. Safely log the backend message if it exists
  const backendError = error?.error?.message || error?.error?.error || 'No backend message';
  console.log('Backend says:', backendError);

  // 3. Clear the store so the app knows the user is definitely logged out
  this.authStore.clear();
  

  // 4. Return null to allow finalize() to run and unlock the app
  return of(null);
}),
    finalize(() => {
      // CRITICAL ORDER:
      // First: stop the spinner
      this.authStore.setLoading(false);
      // Last: open the gate for the Router Guards
      this._isInitialized$.next(true); 
    })
  ).subscribe({});}

  // ─── AUTH ACTIONS ───

  login(payload: LoginPayload): Observable<AuthResponse> {
    this.authStore.setLoading(true);
    return this.apiService.post<AuthResponse>('api/auth/login', payload).pipe(
      tap((res) => {
        this.authStore.setUser(res.user);
        this.router.navigate(['/dashboard']);
      }),
      catchError((error) => {
        this.authStore.clear();
        return throwError(() => error);
      }),
      finalize(() => this.authStore.setLoading(false))
    );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    this.authStore.setLoading(true);
    return this.apiService.post<AuthResponse>('api/auth/register', payload).pipe(
      tap((res) => {
        this.authStore.setUser(res.user);
        this.router.navigate(['/dashboard']);
      }),
      catchError((error) => {
        this.authStore.clear();
        return throwError(() => error);
      }),
      finalize(() => this.authStore.setLoading(false))
    );
  }

  logout(): Observable<any> {
    return this.apiService.post('api/auth/logout', {}).pipe(
      finalize(() => {
        this.authStore.clear();
        this.router.navigate(['/login']);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    // Usually called by an Interceptor when a 401/403 occurs
    return this.apiService.post<AuthResponse>('api/auth/refreshToken');
  }

  // ─── DATA ACTIONS ───

  getForexNews(): Observable<any> {
    return this.apiService.get('api/getForexNews');
  }
}