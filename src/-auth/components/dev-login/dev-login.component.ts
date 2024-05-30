import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { EmailValidator } from 'src/shared/validators/email.validator';
import { Router } from '@angular/router';
import { UserType } from '../../roles';

@Component({
  selector: 'ven-dev-login',

  templateUrl: './dev-login.component.html',

  styleUrls: ['./dev-login.component.scss'],
})
export class DevLoginComponent implements OnInit {
  public loginForm: FormGroup;

  public loading: boolean = false;

  public errorMessage = '';

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],

      password: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.loading = false;
  }

  onSignIn() {
    this.loading = true;
    this.errorMessage = '';

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).catch((error) => {
      console.error(error.message);
      this.errorMessage = error.message;
      this.loading = false;
    });

    this.authService.authUser$.subscribe((authUser) => {
      if (authUser) {
        const type = authUser.type as UserType;
        if (type === UserType.Client) {
          this.router.navigate(['/venture/home']);
        }
        if (type === UserType.Subbie) {
          this.router.navigate(['/venture/jobs']);
        }
      }
    });
  }
}
