import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import createLogger from 'debug';

const logger = createLogger('ven:common:auth');

@Injectable({
  providedIn: 'root',
})
export class StaffGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  public canActivate() {
    if (!this.authService.isAuthenticated) {
      logger('StaffGuardService() not authenticated');
      this.router.navigate(['/venture/login']);
      return false;
    }

    if (!this.authService.isStaff) {
      logger('StaffGuardService() not authorised');
      this.router.navigate(['/venture/403']);
      return false;
    }

    return true;
  }
}
