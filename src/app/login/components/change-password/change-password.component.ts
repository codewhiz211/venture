import { AuthService } from '@auth/services/auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ven-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  public loading: boolean = false;
  public errorMessage: string = '';
  public message: string = '';

  public minPasswordLength = environment.production ? 8 : 5;

  constructor(private router: Router, private authService: AuthService) {}

  public onSubmit(form: NgForm) {
    if (form.value.password && form.value.confirm && form.value.password != form.value.confirm) {
      this.errorMessage = `Passwords don't match`;
      return;
    }
    if (form.value.password && form.value.password.length < this.minPasswordLength) {
      this.errorMessage = `Passwords must be ${this.minPasswordLength} characters or more`;
      return;
    }
    this.change(form.value.password);
  }

  private change(password: string) {
    this.loading = true;
    this.authService.changePassword(this.authService.authUser.uid, password).subscribe(
      () => {
        this.router.navigate([this.authService.homePage]);
      },
      (error) => {
        console.error(error);
        this.loading = false;
        this.errorMessage = 'Something went wrong...';
      }
    );
  }
}
