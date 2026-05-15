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
  private apiService = inject(ApiService);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  // 1. App Initialization Stream
  private readonly _isInitialized$ = new ReplaySubject<boolean>(1);
  readonly isInitialized$ = this._isInitialized$.asObservable();

  // 2. Reactive State Selectors
  readonly isLoggedIn = computed(() => this.authStore.isLoggedIn());

  constructor() {
    //this.initUser();
  }

  
  private initUser() {
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
    }),
    catchError((error) => {
      // Log the error for debugging, but don't break the app
      console.error('Auth initialization failed:', error);
      this.authStore.clear();
      return of(null);
    }),
    finalize(() => {
      // CRITICAL ORDER:
      // First: stop the spinner
      this.authStore.setLoading(false);
      // Last: open the gate for the Router Guards
      this._isInitialized$.next(true); 
    })
  ).subscribe({
    error: (err) => {
       // Secondary safety: Ensure the app unblocks even on catastrophic network failure
       this._isInitialized$.next(true);
    }
  });
}

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