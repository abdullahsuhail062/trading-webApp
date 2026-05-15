// import { inject } from '@angular/core';
// import { Router, CanMatchFn, CanActivateFn } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// import { filter, map, take } from 'rxjs';


// // ✅ protects dashboard — no flash
// export const AuthGuard: CanActivateFn = () => {
//   const auth = inject(AuthService);
//   const router = inject(Router);

//   return auth.isInitialized$.pipe(
//     filter(ready => ready), // Wait for initialization to be true
//     take(1),                // Grab the value and complete the stream
//     map(() => auth.isLoggedIn() ? true : router.parseUrl('/login'))
//   );
// };
