import { Component, OnInit } from '@angular/core';
import { NavMenuItem, NavMenuService } from '@shell/nav-menu.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'ven-application-chrome-bottom-nav',
  templateUrl: 'app-chrome-bottom-nav.component.html',
  styleUrls: ['app-chrome-bottom-nav.component.scss'],
})
export class AppChromeBottomNavComponent implements OnInit {
  public menuItems$: Observable<NavMenuItem[]>;

  constructor(private menuService: NavMenuService) {
    this.menuService.init();
  }

  ngOnInit() {
    this.menuItems$ = this.menuService.menuItems$;
  }
}
