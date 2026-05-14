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
    this.initUser();
  }

  /**
   * Automatically runs on app startup to check for existing sessions via HTTP-only cookies.
   */
  private initUser() {
    if (!isPlatformBrowser(this.platformId)) {
      this._isInitialized$.next(true);
      return;
    }

    // Set loading to true before starting the check
    this.authStore.setLoading(true);

    this.apiService.get<AuthUser>('api/me').pipe(
      // take(1) ensures the stream completes after the first response
      take(1), 
      tap((user) => {
        this.authStore.setUser(user);
      }),
      catchError((error) => {
        this.authStore.clear();
        // Return null so the stream doesn't break
        return of(null);
      }),
      finalize(() => {
        this.authStore.setLoading(false);
        this._isInitialized$.next(true); 
      })
    ).subscribe();
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