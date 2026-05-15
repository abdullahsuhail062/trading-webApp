import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanMatchFn, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';



// ✅ protects dashboard — no flash
export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  return auth.isInitialized$.pipe(
    filter(ready => ready), // Wait for initialization to be true
    take(1),                // Grab the value and complete the stream
    map(() => auth.isLoggedIn() ?true: router.parseUrl('/auth') 
  ));
};
