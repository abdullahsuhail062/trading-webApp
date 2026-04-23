import { signalStore, withState, withMethods, withComputed, withHooks, patchState } from '@ngrx/signals';
import { computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface AuthState {
  user: { name: string; email: string } | null;
  token: string | null;
  isLoading: boolean;
}

// ─── Initial State ────────────────────────────────────
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
};


// safe localStorage helper
const createStorage =(platformId: object) =>{
  const isBrowser = isPlatformBrowser(platformId);
  return {
    get: (key: string) => isBrowser ? localStorage.getItem(key) : null,
    set: (key: string, value: string) => isBrowser && localStorage.setItem(key, value),
    remove: (key: string) => isBrowser && localStorage.removeItem(key),
  };
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user, token }) => ({
    isLoggedIn: computed(() => !!token()),
    userName: computed(() => user()?.name ?? 'Guest'),
  })),
  withMethods((store) => {
    const storage = createStorage(inject(PLATFORM_ID));
    return {
      setUser(user: AuthState['user'], token: string) {
        patchState(store, { user, token });
        storage.set('token', token);
        storage.set('user', JSON.stringify(user));
      },
      setLoading(isLoading: boolean) {
        patchState(store, { isLoading });
      },
      logout() {
        patchState(store, { user: null, token: null });
        storage.remove('token');
        storage.remove('user');
      },
    };
  }),
  withHooks({
    onInit(store) {
      const storage = createStorage(inject(PLATFORM_ID));
      const token = storage.get('token');
      const user = storage.get('user');
      if (token && user) {
        patchState(store, { user: JSON.parse(user), token });
      }
    }
  })
);