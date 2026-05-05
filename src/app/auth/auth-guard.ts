import { inject } from '@angular/core';
import { Router, CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ✅ protects dashboard — no flash
export const AuthGuard: CanMatchFn = () => {
  const isLoggedIn = inject(AuthService).isLoggedIn()
  const router = inject(Router);

  if (isLoggedIn) {
    return true;
  }
  return router.createUrlTree(['/auth']);
};
