import { Routes } from '@angular/router';
import {publicGuard} from './auth/public-guard'
import {authGuard} from './auth/auth-guard'
import { LandingComponent } from './components/landing/landing';
import { AuthComponent } from './components/auth/auth';
import { Dashboard } from './components/dashboard/dashboard';
import { from } from 'rxjs';
export const routes: Routes = [
  { path: '', component: LandingComponent },
  {path: 'auth', component: AuthComponent, canActivate: [publicGuard]},
    {path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];