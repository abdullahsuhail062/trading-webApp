// src/app/interceptors/auth.interceptor.ts

import {
  HttpErrorResponse,
  HttpInterceptorFn
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


// Signal-based refresh state
const isRefreshing = signal(false);

// Signal for refresh completion
const refreshCompleted = signal(false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isPublic = PUBLIC_ENDPOINTS.some(endpoint =>
    req.url.includes(endpoint)
  );

  // Always send cookies
  const authReq = req.clone({
    withCredentials: true
  });

  if (isPublic) {
    return next(authReq);
  }

  return next(authReq).pipe(

    catchError((error: HttpErrorResponse) => {

      // Only handle unauthorized errors
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // If refresh already happening
      if (isRefreshing()) {

        // Wait until refresh completes
        return toObservable(refreshCompleted).pipe(

          filter(completed => completed),

          take(1),

          switchMap(() => next(authReq))
        );
      }

      // Start refresh
      isRefreshing.set(true);
      refreshCompleted.set(false);

      return authService.refreshToken().pipe(

        switchMap(() => {

          // Notify waiting requests
          refreshCompleted.set(true);

          // Retry original request
          return next(authReq);
        }),

        catchError((refreshError) => {

          authService.logout()

          router.navigate(['/login']);

          return throwError(() => refreshError);
        }),

        finalize(() => {

          isRefreshing.set(false);
        })
      );
    })
  );
};