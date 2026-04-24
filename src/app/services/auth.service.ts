import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthStore } from '../auth/auth.store';
import { ApiService } from './api.service';  // ✅ import ApiService

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: { name: string; email: string };
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiService = inject(ApiService); // ✅ use ApiService
  private router = inject(Router);
  private authStore = inject(AuthStore);

 
  // ─── Login ───────────────────────────────────────────
  login(payload: LoginPayload) {
    this.authStore.setLoading(true);
    return this.apiService.post<AuthResponse>('users/loginUser', payload).pipe(
      tap((res) => {
        this.authStore.setUser(res.user, res.token);
        this.authStore.setLoading(false);
        alert('Logged in successfully!')
        this.router.navigate(['/dashboard']);
      }),
      catchError((error) => {
        this.authStore.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  // ─── Register ────────────────────────────────────────
  register(payload: RegisterPayload) {
    this.authStore.setLoading(true);
    return this.apiService.post<AuthResponse>('users/registerUser', payload).pipe(
      tap((res) => {
        this.authStore.setUser(res.user, res.token);
        this.authStore.setLoading(false);
        this.router.navigate(['/dashboard']);
      }),
      catchError((error) => {
        this.authStore.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  // ─── Logout ───────────────────────────────────────────
  logout() {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }

  // ─── Get current token ────────────────────────────────
  getToken(): string | null {
    return this.authStore.token();
  }

  // ─── Check if logged in ───────────────────────────────
  isLoggedIn(): boolean {
    return this.authStore.isLoggedIn();
  }

  // ─── Load user from localStorage on app start ─────────
  // ⚠️ optional — AuthStore.onInit() already does this
  loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.authStore.setUser(JSON.parse(user), token);
    }
  }
}