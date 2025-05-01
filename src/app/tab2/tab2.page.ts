import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})

export class Tab2Page {
  emailorusername = ''
  email = '';
  password = '';
  enterpassword = '';
  confirmpassword = '';
  username = '';
  name = '';
  surname = '';
  newemail = '';
  phone = '';
  balance = 0;
  roleId: number | null = null;
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

  loggedName = '';
  loggedSurname = '';
  loggedEmail = '';

  constructor (
    private authService: AuthService, 
    private userService: UserService, 
    private loadingController: LoadingController, 
    private toastController: ToastController,
    private paymentService: PaymentService,
    private http: HttpClient,
  ) {}

  loadBalance() {
    const userId = this.userService.getUserIdFromToken();
    if (!userId) {
      this.presentToast('Could not identify user.', 'danger');
      return;
    }
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.balance = user?.balance ?? 0;
      },
      error: () => {
        this.balance = 0;
      }
    });
  }

  login() {
    if (!this.emailorusername || !this.password) {
      this.presentToast('Please fill in all required fields.', 'warning');
      return;
    }
    this.authService.loginUser({ usernameOrEmail: this.emailorusername, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login success:', response);
        this.authService.setToken(response.token);
        this.loginFailed = false;
        this.loadUserData();       
        this.isLogIn = false;
        this.isSignUp = false;
        this.isPasswordReset = false;
        this.profilePage = true;
        console.log('Name:', this.loggedName);
        console.log('Surname:', this.loggedSurname);
        this.presentToast('Login successful.', 'success');
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
    this.emailorusername = '';
    this.password = '';
    this.loginFailed = false;
    this.loggedEmail = '';
    this.isLogIn = true;
    this.isSignUp = false;
    this.isPasswordReset = false;
    this.profilePage = false;
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
        this.roleId = user?.roleId ?? null;
        this.loggedName = user?.firstName || '';
        this.loggedSurname = user?.lastName || '';
        this.loggedEmail = user?.email || '';
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
        this.roleId = null;
      }
    });
  }

  purchase(amount: number) {
    const userId = this.userService.getUserIdFromToken();

    if (userId === null) {
        this.presentToast('Could not identify user.', 'danger');
        return;
    }
    if (this.roleId === null) {
        this.presentToast('User role information is missing. Cannot complete purchase.', 'danger');
        // this.loadUserData();
        return;
    }

    const payload = {
      userId: userId,
      roleId: this.roleId,
      creditBalance: amount
    };

    this.paymentService.createBalance(payload).subscribe({
      next: (response) => {
        this.presentToast(`Added ${amount} R,- to your balance!`, 'success');
        if (response && typeof response.balance === 'number') {
            this.balance = response.balance;
        } else {
            this.loadBalance();
        }
      },
      error: (err) => {
        console.error('Create balance failed:', err);
        this.presentToast('Payment failed: ' + (err.error?.message || 'Server error'), 'danger');
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
      phoneNumber: this.phone,
      password: this.enterpassword
    };
  
    this.authService.registerUser(newUser).subscribe({
      next: async () => {
        this.isLoading = false;
        await loading.dismiss();
        this.presentToast('Account created successfully! Check your email for confirmation link.', 'success');
        this.toggleForm();
        this.username = '';
        this.name = '';
        this.surname = '';
        this.newemail = '';
        this.phone = '';
        this.enterpassword = '';
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

    const email = this.email;

    console.log('Sending request to:', 'http://localhost:8005/api/auth/reset-password');
    console.log('With body:', { email });
    this.http.get('http://localhost:8005/api/auth/reset-password?email=' + email)
      .subscribe({
        next: (response) => {
          console.log('Response from backend:', response);
          this.presentToast('Reset email sent. Chack your inbox and spam folder.', 'success');
        },
        error: (err) => {
          console.error('Error sending request:', err); 
          this.presentToast('Something went wrong.', 'warning');
        }
      });
  }

  showLogin() {
    this.isPasswordReset = false;
    this.isSignUp = false;
    this.isLogIn = true;
  }
}