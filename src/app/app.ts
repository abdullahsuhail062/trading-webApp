import { Component } from '@angular/core';
import { AuthComponent } from './components/auth/auth';

@Component({
  selector: 'app-root',
  imports: [AuthComponent],
  template: '<app-auth></app-auth>',
  styleUrl: './app.css'
})
export class App {}
