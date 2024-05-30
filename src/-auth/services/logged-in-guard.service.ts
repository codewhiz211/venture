import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

// TODO we might need to redirect to appropriate app??
@Injectable({
  providedIn: 'root',
})
export class LoggedInGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  public canActivate() {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/venture/clients']);
      return false;
    } else {
      return true;
    }
  }
}
