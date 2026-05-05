import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthStore, AuthUser } from '../auth/auth-store'; 
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
  user: {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatar: string;
  isAdmin: boolean;
  role: string;
}
}
@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiService = inject(ApiService);
  private router = inject(Router);
  private authStore = inject(AuthStore);

  // ─── Init user from cookie session ───
  initUser() {
    return this.apiService.get<AuthUser>('api/me').pipe(
      tap((user) => {
        this.authStore.setUser(user);
        this.authStore.setLoading(false);
      }),
      catchError((error) => {
        this.authStore.clear();
        return throwError(() => error);
      })
    );
  }

  // ─── Login ───
  login(payload: LoginPayload) {
    this.authStore.setLoading(true);

    return this.apiService.post<AuthResponse>('api/auth/login', payload).pipe(
      tap((res) => {
        // cookie already set by backend
        this.authStore.setUser(res.user);
        this.router.navigate(['/dashboard']);
      }),
      catchError((error) => {
        this.authStore.clear();
        return throwError(() => error);
      })
    );
  }

  // ─── Register ───
  register(payload: RegisterPayload) {
    this.authStore.setLoading(true);

    return this.apiService.post<AuthResponse>('api/auth/register', payload).pipe(
      tap((res) => {
        this.authStore.setUser(res.user);
        this.router.navigate(['/dashboard']);
      }),
      catchError((error) => {
        this.authStore.clear();
        return throwError(() => error);
      })
    );
  }

  // ─── Logout (IMPORTANT FIX) ───
  logout() {
    return this.apiService.post('api/auth/logout', {}).pipe(
      tap(() => {
        this.authStore.clear();
        this.router.navigate(['/login']);
      })
    );
  }

  // ─── Auth check ───
  isLoggedIn(): boolean {
    return this.authStore.isLoggedIn();
  }

  getForexNews() {
    return this.apiService.get('api/getForexNews');
  }
}