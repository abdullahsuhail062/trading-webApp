import { CanActivateFn, Router, CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { filter, map, take } from 'rxjs';



// export const publicGuard: CanActivateFn = (route, state) => {
//   const isLoggedIn = inject(AuthService).isLoggedIn();
//   const router = inject(Router)
//   return isLoggedIn ? router.parseUrl('/dashboard'):
//   true;
// };


export const PublicGuard: CanMatchFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router);

  
    return auth.isInitialized$.pipe(
      filter(ready => ready), // Wait for initialization to be true
      take(1),                // Grab the value and complete the stream
      map(() => auth.isLoggedIn() ? true : router.parseUrl('/login'))
    );
};
