import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import createLogger from 'debug';

const logger = createLogger('ven:common:auth');

@Injectable({
  providedIn: 'root',
})
export class DefaultPasswordGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  public canActivate() {
    if (this.authService.authUser?.defaultPassword) {
      logger(`DefaultPasswordGuardService() password not changed`);
      this.router.navigate(['/venture/change-password']);
      return false;
    }
    return true;
  }
}
