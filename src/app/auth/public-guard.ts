import { CanActivateFn, Router, CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';


// export const publicGuard: CanActivateFn = (route, state) => {
//   const isLoggedIn = inject(AuthService).isLoggedIn();
//   const router = inject(Router)
//   return isLoggedIn ? router.parseUrl('/dashboard'):
//   true;
// };


export const PublicGuard: CanMatchFn = () => {
  const isLoggedIn = inject(AuthService).isLoggedIn();
  const router = inject(Router);

  if (isLoggedIn) {
    return router.createUrlTree(['/dashboard']);
  }
  return true;
};
