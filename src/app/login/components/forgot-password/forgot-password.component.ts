import { AuthService } from '@auth/services/auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'ven-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  public loading: boolean = false;
  public resetSent: boolean = false;
  public errorMessage: string = '';
  public message: string = '';

  constructor(private authService: AuthService) {}

  onReset(form: NgForm) {
    const email = form.value.email;
    this.loading = true;
    this.authService
      .requestPasswordReset(email)
      .then(() => {
        this.loading = false;
        this.resetSent = true;
        this.message = 'Please check your inbox';
      })
      .catch((error) => {
        this.loading = false;
        this.errorMessage = error.message;
      });
  }
}
