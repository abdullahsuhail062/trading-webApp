import { inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthStore } from '../auth/auth.store';

// endpoints that don't need a token
const PUBLIC_ENDPOINTS = ['auth/login', 'auth/register'];

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const platformId = inject(PLATFORM_ID);

  // skip public endpoints
  const isPublic = PUBLIC_ENDPOINTS.some(endpoint => req.url.includes(endpoint));
  if (isPublic) return next(req);

  // get token from store first, fallback to localStorage
  let token = authStore.token();
  if (!token && isPlatformBrowser(platformId)) {
    token = localStorage.getItem('token');
  }

  // attach token if exists
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};