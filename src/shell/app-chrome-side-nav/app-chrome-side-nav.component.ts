import { NavMenuItem, NavMenuService } from '@shell/nav-menu.service';

import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ven-application-chrome-side-nav',
  templateUrl: 'app-chrome-side-nav.component.html',
  styleUrls: ['app-chrome-side-nav.component.scss'],
})
export class AppChromeSideNavComponent {
  public menuItems$: Observable<NavMenuItem[]>;

  constructor(private menuService: NavMenuService) {
    this.menuItems$ = menuService.menuItems$;
  }
}
