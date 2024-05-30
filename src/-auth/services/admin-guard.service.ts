import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import createLogger from 'debug';

const logger = createLogger('ven:common:auth');

@Injectable()
export class AdminGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  public canActivate() {
    if (this.authService.isAuthenticated && this.authService.isAdmin) {
      return true;
    } else {
      logger('AdminGuardService: Not an admin');
      this.router.navigate(['/venture/clients']);
      return false;
    }
  }
}
