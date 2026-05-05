import { Injectable, signal, computed } from '@angular/core';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {

  // ─── Signals ─────────────────────────────
  private _user    = signal<AuthUser | null>(null);
  private _loading = signal<boolean>(true);

  // ─── Public ──────────────────────────────
  readonly user      = this._user.asReadonly();
  readonly isLoading = this._loading.asReadonly();

  // ─── Computed ────────────────────────────
  readonly isLoggedIn = computed(() => !!this._user());
  readonly userName   = computed(() => this._user()?.name ?? 'Guest');
  readonly isAdmin    = computed(() => this._user()?.isAdmin ?? false);

  // ─── Methods ─────────────────────────────
  setUser(user: AuthUser) {
    this._user.set(user);
    this._loading.set(false);
  }

  clear() {
    this._user.set(null);
    this._loading.set(false);
  }

  setLoading(val: boolean) {
    this._loading.set(val);
  }
}