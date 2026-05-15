import { APP_INITIALIZER, ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { withInterceptors, provideHttpClient, withFetch } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor';
import { AuthService } from './services/auth.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),provideHttpClient(withFetch(),withInterceptors([authInterceptor])),
    provideRouter(routes), provideClientHydration(withEventReplay(),),provideCharts(withDefaultRegisterables()),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.initUser(); // Must return a Promise or Observable
    })
  ]
};
