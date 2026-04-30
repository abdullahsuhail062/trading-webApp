import { Component } from '@angular/core';
import { AuthComponent } from './components/auth/auth';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [AuthComponent,RouterOutlet],
  template: '<router-outlet',
  styleUrl: './app.css'
})
export class App {}
