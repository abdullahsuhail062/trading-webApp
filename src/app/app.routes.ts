import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing';
import { AuthComponent } from './components/auth/auth';
import { Dashboard } from './components/dashboard/dashboard';
export const routes: Routes = [
  { path: '', component: LandingComponent },
  {path: 'auht', component: AuthComponent},
    {path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: '' }
];