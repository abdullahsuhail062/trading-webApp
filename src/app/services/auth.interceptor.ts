// src/app/interceptors/auth.interceptor.ts
import { BehaviorSubject} from 'rxjs';



import {
  HttpErrorResponse,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';

import {
  inject,
  signal
} from '@angular/core';

import { Router } from '@angular/router';

import {
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  throwError
} from 'rxjs';

import { toObservable } from '@angular/core/rxjs-interop';

import { AuthService } from '../services/auth.service';


// Public endpoints
const PUBLIC_ENDPOINTS = [
  'auth/login',
  'auth/register',
  'auth/refresh'
];


// // Signal-based refresh state
// const isRefreshing = signal(false);

// // Signal for refresh completion
// const refreshCompleted = signal(false);

// export const authInterceptor: HttpInterceptorFn = (req, next) => {

//   const authService = inject(AuthService);
//   const router = inject(Router);

//   const isPublic = PUBLIC_ENDPOINTS.some(endpoint =>
//     req.url.includes(endpoint)
//   );

//   // Always send cookies
//   const authReq = req.clone({
//     withCredentials: true
//   });

//   if (isPublic) {
//     return next(authReq);
//   }

//   return next(authReq).pipe(

//     catchError((error: HttpErrorResponse) => {

//       // Only handle unauthorized errors
//       if (error.status !== 401) {
//         return throwError(() => error);
//       }

//       // If refresh already happening
//       if (isRefreshing()) {

//         // Wait until refresh completes
//         return toObservable(refreshCompleted).pipe(

//           filter(completed => completed),

//           take(1),

//           switchMap(() => next(authReq))
//         );
//       }

//       // Start refresh
//       isRefreshing.set(true);
//       refreshCompleted.set(false);

//       return authService.refreshToken().pipe(

//         switchMap(() => {

//           // Notify waiting requests
//           refreshCompleted.set(true);

//           // Retry original request
//           return next(authReq);
//         }),

//         catchError((refreshError) => {

//           authService.logout()

//           router.navigate(['/login']);

//           return throwError(() => refreshError);
//         }),

//         finalize(() => {

//           isRefreshing.set(false);
//         })
//       );
//     })
//   );
// };

// const refreshTokenSubject = new BehaviorSubject<boolean>(false);
// let isRefreshingFlag = false; // Simple variable is safer here than a signal

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   const isPublic = PUBLIC_ENDPOINTS.some(endpoint => req.url.includes(endpoint));
//   const authReq = req.clone({ withCredentials: true });

//   if (isPublic) return next(authReq);

//   return next(authReq).pipe(
//     catchError((error: HttpErrorResponse) => {
//       if (error.status !== 401) return throwError(() => error);

//       if (isRefreshingFlag) {
//         // 2. Wait for the subject to emit 'true' (meaning refresh finished)
//         return refreshTokenSubject.pipe(
//           filter(success => success === true),
//           take(1),
//           // IMPORTANT: Clone again to ensure fresh request state
//           switchMap(() => next(req.clone({ withCredentials: true })))
//         );
//       }

//       isRefreshingFlag = true;
//       refreshTokenSubject.next(false); // Close the gate

//       return authService.refreshToken().pipe(
//         switchMap(() => {
//           isRefreshingFlag = false;
//           refreshTokenSubject.next(true); // Open the gate
//           return next(req.clone({ withCredentials: true }));
//         }),
//         catchError((refreshError) => {
//           isRefreshingFlag = false;
//           refreshTokenSubject.next(false);
//           authService.logout();
//           router.navigate(['/login']);
//           return throwError(() => refreshError);
//         })
//       );
//     })
//   );
// };

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  // Clone the request to add the authentication header.
  const newReq = req.clone({
    withCredentials: true,
  });
  console.log(newReq, 'token being inspected');
  
  return next(newReq);
}