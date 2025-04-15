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
  enterpassword = '';
  confirmpassword = '';
  name = '';
  surname = '';
  newemail = '';
  phone = '';
  isSignUp = false;
  isLogIn = true;
  loginFailed = false;
  hidePassword = true;
  isPasswordReset = false;
  profilePage = true;
  paymentPage = false;
  privacyPage = false;
  editPage = false;

  editname = 'Novak'
  editsurname = 'Djoković'
  editemail = 'djokovic@gmail.com'
  editphone = '+420111111111'
  
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
    this.isLogIn = !this.isLogIn;
    this.isPasswordReset = false;
  }

  passwordReset() {
    this.isPasswordReset = true;
    this.isSignUp = false;
    this.isLogIn = false;
  }

  showEdit() {
    this.paymentPage = false;
    this.profilePage = false;
    this.privacyPage = false;
    this.editPage = true;
  }

  showPrivacy() {
    this.paymentPage = false;
    this.profilePage = false;
    this.privacyPage = true;
    this.editPage = false;
  }

  showProfile() {
    this.paymentPage = false;
    this.profilePage = true;
    this.privacyPage = false;
    this.editPage = false;
  }

  addFunds() {
    this.paymentPage = true;
    this.profilePage = false;
    this.privacyPage = false;
    this.editPage = false;
  }

  sendPasswordReset() {
    if (!this.email) {
      alert('Please enter your email.');
      return;
    }
  
    alert(`Reset link sent to ${this.email}`);
    this.isPasswordReset = false;
    this.isSignUp = false;
    this.isLogIn = true;
  }

  showLogin() {
    this.isPasswordReset = false;
    this.isSignUp = false;
    this.isLogIn = true;
  }
}