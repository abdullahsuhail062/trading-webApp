// auth.store.ts
import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ─── Interfaces ───────────────────────────────────────
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatar: string;
  isAdmin: boolean;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
}

// ─── Storage Keys ─────────────────────────────────────
const STORAGE_KEYS = {
  token: 'auth_token',
  user: 'auth_user'
} as const;

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private platformId = inject(PLATFORM_ID);
  private storage = this.createStorage();

  // ─── Private Signals ──────────────────────────────
  private _user    = signal<AuthUser | null>(null);
  private _token   = signal<string | null>(null);
  private _loading = signal<boolean>(false);

  // ─── Public Readonly Signals ──────────────────────
  readonly user      = this._user.asReadonly();
  readonly token     = this._token.asReadonly();
  readonly isLoading = this._loading.asReadonly();

  // ─── Computed Signals ─────────────────────────────
  readonly isLoggedIn  = computed(() => !!this._token());
  readonly userName    = computed(() => this._user()?.name ?? 'Guest');
  readonly userAvatar  = computed(() => this._user()?.avatar ?? null);
  readonly isAdmin     = computed(() => this._user()?.isAdmin ?? false);
  readonly userRole    = computed(() => this._user()?.role ?? null);
  readonly userId      = computed(() => this._user()?.id ?? null);

  constructor() {
    this.rehydrate();  // restore session on app start
  }

  // ─── Methods ──────────────────────────────────────
  setUser(user: AuthUser, token: string) {
    this._user.set(user);
    this._token.set(token);
    try {
      this.storage.set(STORAGE_KEYS.token, token);
      this.storage.set(STORAGE_KEYS.user, JSON.stringify(user));
    } catch (e) {
      console.warn('localStorage quota exceeded:', e);
    }
  }

  setLoading(isLoading: boolean) {
    this._loading.set(isLoading);
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this.storage.remove(STORAGE_KEYS.token);
    this.storage.remove(STORAGE_KEYS.user);
  }

  // ─── Private Helpers ──────────────────────────────
  private rehydrate() {
    const token = this.storage.get(STORAGE_KEYS.token);
    const user  = this.storage.get(STORAGE_KEYS.user);

    if (!token || !user) return;

    if (this.isTokenExpired(token)) {
      this.storage.remove(STORAGE_KEYS.token);
      this.storage.remove(STORAGE_KEYS.user);
      return;
    }

    try {
      this._user.set(JSON.parse(user));
      this._token.set(token);
    } catch {
      this.storage.remove(STORAGE_KEYS.token);
      this.storage.remove(STORAGE_KEYS.user);
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private createStorage() {
    const isBrowser = isPlatformBrowser(this.platformId);
    return {
      get: (key: string) =>
        isBrowser ? localStorage.getItem(key) : null,
      set: (key: string, value: string) => {
        if (!isBrowser) return;
        localStorage.setItem(key, value);
      },
      remove: (key: string) => {
        if (!isBrowser) return;
        localStorage.removeItem(key);
      }
    };
  }
}