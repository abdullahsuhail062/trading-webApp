import { CanActivateFn, Router, CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject, PLATFORM_ID } from '@angular/core';
import { filter, map, take } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';






export const PublicGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
     if (!auth.isLoggedIn()) {
    return true
  }
  return router.parseUrl('/dashboard')
  // if (!isPlatformBrowser(platformId)) {
  //   return false
  // }

  
  //   return auth.isInitialized$.pipe(
  //     filter(ready => ready), // Wait for initialization to be true
  //     take(1),                // Grab the value and complete the stream
  //     map(() => !auth.isLoggedIn() ? true : router.parseUrl('/dashboard'))
  //   );
};
