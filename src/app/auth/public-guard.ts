import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';


export const publicGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthService).isLoggedIn();
  const router = inject(Router)
  return isLoggedIn ? router.parseUrl('/dashboard'):
  true;
};
