import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from '@auth/services/auth.service';
import { BaseComponent } from '@shared/components/base.component';
import { Component, Inject } from '@angular/core';
import { EmailValidator } from '@shared/validators/email.validator';
import { Router } from '@angular/router';
import { APP_CONFIG } from 'app.config';

@Component({
  selector: 'ven-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent extends BaseComponent {
  public loginForm: FormGroup;
  public loading$: Observable<boolean>;

  private _error: BehaviorSubject<string> = new BehaviorSubject(null);
  private readonly error$: Observable<string> = this._error.asObservable();

  private _submitted: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private readonly submitted$: Observable<boolean> = this._submitted.asObservable();

  private env: string;

  constructor(@Inject(APP_CONFIG) config, private router: Router, private formBuilder: FormBuilder, private authService: AuthService) {
    super();
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.required])],
    });

    this.env = config.env;

    this.loading$ = combineLatest(this.authService.authUser$, this.submitted$, this.error$).pipe(
      map(([authUser, submitted, error]) => {
        console.log(error);
        if (error) {
          return false;
        }
        if (submitted && !authUser) {
          return true;
        }
        return false;
      })
    );

    // https://github.com/angular/angular/issues/19163#issuecomment-364517870
    // this.loginForm = new FormGroup(this.loginForm.controls, { updateOn: 'blur' });
  }

  onSignIn() {
    this._submitted.next(true);
    this._error.next(null);

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).catch((error) => {
      this._error.next(this.getErrorMessage(error));
    });

    this.authService.authUser$.pipe(this.takeUntilDestroy()).subscribe((authUser) => this.handleLoginSuccess(authUser));
  }

  private async handleLoginSuccess(authUser) {
    if (authUser) {
      this.router.navigate([this.authService.homePage]);
    }
  }

  private getErrorMessage(error: any): string {
    if (this.env !== 'PROD') {
      console.log(error);
      return error.message;
    }
    return 'Invalid email or password';
  }
}
