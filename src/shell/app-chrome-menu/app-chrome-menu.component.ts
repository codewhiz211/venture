import { HeaderMenuItem, HeaderMenuService } from '@shell/header-menu.service';

import { AuthService } from '@auth/services/auth.service';
import { AuthUser } from '@auth/types';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import createLogger from 'debug';

export const logger = createLogger('ven:subbies:app');

@Component({
  selector: 'ven-application-chrome-menu',
  templateUrl: './app-chrome-menu.component.html',
  styleUrls: ['./app-chrome-menu.component.scss'],
})
export class AppChromeMenuComponent {
  public menuItems$: Observable<HeaderMenuItem[]>;

  constructor(private router: Router, public authService: AuthService, private menuService: HeaderMenuService) {
    this.menuItems$ = this.menuService.menuItems$;
  }

  onItemClick(item) {
    item.method();
  }

  userEmail() {
    const userInfo = this.authService.authUser as AuthUser;
    return userInfo ? userInfo.email.split('@')[0] : null;
  }

  onLogout() {
    this.authService.authUser$.subscribe((authState) => {
      if (!authState) {
        this.router.navigate(['/venture/login']);
      }
    });
    this.authService.logout();
  }
}
