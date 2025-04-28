import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { LoadingController, ToastController } from '@ionic/angular';

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
  username = '';
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
  isLoading = false;

  editname = 'Novak'
  editsurname = 'Djoković'
  editemail = 'djokovic@gmail.com'
  editphone = '+420691337420'
  
  constructor(private authService: AuthService, private userService: UserService, private loadingController: LoadingController, private toastController: ToastController) {}

  login() {
    this.authService.loginUser({ usernameOrEmail: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login success:', response);
        if (response && response.token) {
          this.authService.setToken(response.token);
          this.loginFailed = false;
          this.loadUserData();       
          this.isLogIn = false;
          this.isSignUp = false;
          this.isPasswordReset = false;
          this.profilePage = true;
        } else {
          this.presentToast('Login successful.', 'success');
        }
      },
      error: (err) => {
        this.loginFailed = true;
        console.error('Login failed:', err);
        this.presentToast(
          'Login failed: ' +
          (err.error?.message || err.message || 'Unknown error'),
          'danger'
        );
      }
    });
  }

  logout() {
    this.authService.logout();
    this.email = '';
    this.password = '';
    this.loginFailed = false;
    this.presentToast('Succesfully logged out.', 'success');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  loadUserData() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.username = user?.userName || '';
        this.name = user?.firstName || '';
        this.surname = user?.lastName || '';
        this.phone = user?.phoneNumber || '';
        this.newemail = user?.email || '';
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  async signup() {
    if (!this.username || !this.name || !this.surname || !this.newemail || !this.phone || !this.enterpassword || !this.confirmpassword) {
      this.presentToast('Please fill in all required fields.', 'warning');
      return;
    }
  
    if (this.enterpassword !== this.confirmpassword) {
      this.presentToast('Passwords do not match.', 'warning');
      return;
    }
  
    this.isLoading = true;
  
    const loading = await this.loadingController.create({
      message: 'Creating account...',
      spinner: 'crescent',
      backdropDismiss: false
    });
  
    await loading.present();
  
    const newUser = {
      userName: this.username,
      firstName: this.name,
      lastName: this.surname,
      email: this.newemail,
      password: this.enterpassword
    };
  
    this.authService.registerUser(newUser).subscribe({
      next: async () => {
        this.isLoading = false;
        await loading.dismiss();
        this.presentToast('Account created successfully! Check your email for confirmation link.', 'success');
        this.toggleForm();
      },
      error: async (err) => {
        this.isLoading = false;
        await loading.dismiss();
        console.error('Registration failed:', err);
        this.presentToast(
          'Registration failed: ' +
          (err.error?.message || err.message || 'Unknown error'),
          'danger'
        );
      }
    });
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
      this.presentToast('Please enter your email.', 'warning');
      return;
    }
  
    this.presentToast(`Reset link sent to ${this.email}`, 'success');
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