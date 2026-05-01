import { signalStore, withState, withMethods, withComputed, withHooks, patchState } from '@ngrx/signals';
import { computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// ✅ separate interface
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

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
};

// ✅ constants for storage keys
const STORAGE_KEYS = {
  token: 'auth_token',
  user: 'auth_user'
} as const;

// ✅ SSR safe storage
const createStorage = (platformId: object) => {
  const isBrowser = isPlatformBrowser(platformId);
  return {
    get: (key: string) => isBrowser ? localStorage.getItem(key) : null,
    set: (key: string, value: string) => {
      if (!isBrowser) return;
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('localStorage quota exceeded:', e);
      }
    },
    remove: (key: string) => isBrowser && localStorage.removeItem(key),
  };
};

// ✅ JWT expiry check
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  // ✅ more computed signals
  withComputed(({ user, token }) => ({
    isLoggedIn:  computed(() => !!token()),
    userName:    computed(() => user()?.name ?? 'Guest'),
    userAvatar:  computed(() => user()?.avatar ?? null),
    isAdmin:     computed(() => user()?.isAdmin ?? false),
    userRole:    computed(() => user()?.role ?? null),
    userId:      computed(() => user()?.id ?? null),
  })),

  withMethods((store) => {
    // ✅ create once
    const storage = createStorage(inject(PLATFORM_ID));
    return {
      setUser(user: AuthUser, token: string) {
        patchState(store, { user, token });
        storage.set(STORAGE_KEYS.token, token);
        storage.set(STORAGE_KEYS.user, JSON.stringify(user));
      },
      setLoading(isLoading: boolean) {
        patchState(store, { isLoading });
      },
      logout() {
        patchState(store, { user: null, token: null });
        storage.remove(STORAGE_KEYS.token);
        storage.remove(STORAGE_KEYS.user);
      },
    };
  }),

  withHooks({
    onInit(store) {
      const storage = createStorage(inject(PLATFORM_ID));
      const token = storage.get(STORAGE_KEYS.token);
      const user = storage.get(STORAGE_KEYS.user);

      if (!token || !user) return;

      // ✅ check expiry before restoring
      if (isTokenExpired(token)) {
        storage.remove(STORAGE_KEYS.token);
        storage.remove(STORAGE_KEYS.user);
        return;
      }

      try {
        patchState(store, { user: JSON.parse(user), token });
      } catch {
        storage.remove(STORAGE_KEYS.token);
        storage.remove(STORAGE_KEYS.user);
      }
    }
  })
);