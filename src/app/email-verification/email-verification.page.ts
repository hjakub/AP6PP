import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
  standalone: false,
})
export class EmailVerificationPage implements OnInit {
  message: string = 'Ověřuji e-mail...';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.verifyEmail(token).subscribe({
          next: () => {
            this.message = 'E-mail úspěšně ověřen. Můžeš se přihlásit.';
          },
          error: (err) => {
            this.message = 'Ověření e-mailu selhalo nebo odkaz vypršel.';
            console.error(err);
          }
        });
      } else {
        this.message = 'Chybí ověřovací token.';
      }
    });
  }
}