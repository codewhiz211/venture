import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';
import { NgForm } from '@angular/forms';
import createLogger from 'debug';

const logger = createLogger('ven:staff');

@Component({
  selector: 'ven-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  @Input() authData;

  public email: string;
  public loading: boolean = true;
  public expired: boolean = false;
  public resetComplete: boolean = false;
  public errorMessage: string = '';
  public message: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.verifyResetPasswordCode(this.authData.oobCode).then(
      (email) => {
        this.email = email;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Reset Link has expired, please try again';
        this.expired = true;
        logger.error(error);
      }
    );
  }

  onSave(form: NgForm) {
    const password = form.value.password;
    this.loading = true;
    this.authService
      .resetPassword(this.authData.oobCode, password)
      .then(() => {
        this.loading = false;
        this.resetComplete = true;
        this.message = 'Please check your inbox';
      })
      .catch((error) => {
        this.loading = false;
        this.errorMessage = error.message;
        logger.error(error.message);
      });
  }
}
