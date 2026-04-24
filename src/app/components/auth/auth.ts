import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


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

  constructor(private authService: AuthService) {}
  
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
    console.log(this.signInData,"data tracked!");
    
    this.authService.login(this.signInData).subscribe({next: (res) =>{console.log('data received from backend',res);
    }, error: (err) =>{console.log(err);
}})
  }

  onSignUp() {
    this.authService.register(this.signUpData).subscribe({next: (res) => {console.log('data recieved from backend', res);}, error: (err) => {console.log(err);
    }})
    
  }
}