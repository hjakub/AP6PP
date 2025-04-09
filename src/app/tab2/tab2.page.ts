import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  email = '';
  password = '';
  isSignUp = false;
  loginFailed = false;
  
  constructor(private authService: AuthService) {}

  login() {
    if (this.authService.login(this.email, this.password)) {
      this.loginFailed = false;
    } else {
      this.loginFailed = true;
      alert('Invalid email or password.');
    }
  }

  logout() {
    this.authService.logout();
    this.email = '';
    this.password = '';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleForm() {
    this.isSignUp = !this.isSignUp;
  }

  passwordReset() {
    
  }

  showReservations() {
    
  }

  showSettings() {
    
  }

  showPrivacy() {
    
  }
}