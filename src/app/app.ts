import { Component, OnInit } from '@angular/core';
import { AuthComponent } from './components/auth/auth';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AuthStore } from './auth/auth-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet/>',
  styleUrl: './app.css'
})
export class App  {

  constructor(private authService: AuthService, private authStore: AuthStore) {}

}

