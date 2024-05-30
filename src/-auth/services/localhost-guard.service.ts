import { CanActivate, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import createLogger from 'debug';

const logger = createLogger('ven:common:auth');

@Injectable({
  providedIn: 'root',
})
export class LocalHostGuardService implements CanActivate {
  constructor(private router: Router) {}

  public canActivate() {
    if (window.location.hostname === 'localhost' && window.location.port !== undefined) {
      logger('is localhost');
      return true;
    }
    logger('is NOT localhost go home');
    this.router.navigate(['/venture/home']);

    return false;
  }
}
