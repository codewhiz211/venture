import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import createLogger from 'debug';

const logger = createLogger('ven:common:auth');

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  public canActivate() {
    if (!this.authService.isAuthenticated) {
      logger(`AuthGuardService() not authenticated ${window.location.href}`);
      this.router.navigate(['/venture/login']);
      return false;
    } else {
      return true;
    }
  }
}
