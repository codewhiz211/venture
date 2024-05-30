import { AppBarMenuItem, AppBarMenuService } from '@shell/app-bar-menu.service';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

@Component({
  selector: 'ven-application-chrome-header-buttons',
  templateUrl: './app-chrome-header-buttons.component.html',
  styleUrls: ['./app-chrome-header-buttons.component.scss'],
})
export class AppChromeHeaderButtonsComponent implements OnInit {
  public menuItems$: Observable<AppBarMenuItem[]>;

  constructor(private menuService: AppBarMenuService) {}

  ngOnInit() {
    this.menuItems$ = this.menuService.menuItems$;
  }

  public onItemClick(item) {
    item.method();
  }
}
