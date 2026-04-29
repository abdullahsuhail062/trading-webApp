import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing/landing';
import { AuthComponent } from './components/auth/auth';
import { Dashboard } from './components/auth/dashboard/dashboard';
export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'auth', component: AuthComponent },
  {path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: '' }
];