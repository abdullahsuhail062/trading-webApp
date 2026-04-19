import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {
  isSignUp = signal(false);
  showPassword = signal(false);
  
  // Form data
  signInData = {
    email: '',
    password: '',
    rememberMe: false
  };
  
  signUpData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  };

  toggleMode() {
    this.isSignUp.update(v => !v);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSignIn() {
    console.log('Sign in:', this.signInData);
  }

  onSignUp() {
    console.log('Sign up:', this.signUpData);
  }
}