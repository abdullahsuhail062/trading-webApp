import { inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

// endpoints that don't need a token
const PUBLIC_ENDPOINTS = ['auth/login', 'auth/register'];

  const platformId = inject(PLATFORM_ID);

 export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isPublic = ['auth/login', 'auth/register']
    .some(endpoint => req.url.includes(endpoint));

  if (isPublic) return next(req);

  return next(req.clone({
    withCredentials: true
  }));
};