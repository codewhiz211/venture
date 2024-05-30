import { Component, Input } from '@angular/core';
import { NavMenuItem, NavMenuService } from '@shell/nav-menu.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'ven-application-chrome-bottom-nav-button',
  templateUrl: 'app-chrome-bottom-nav-button.component.html',
  styleUrls: ['app-chrome-bottom-nav-button.component.scss'],
})
export class AppChromeBottomNavButtonComponent {
  @Input() action: NavMenuItem;

  public active: boolean = false;

  constructor(private menuService: NavMenuService, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.active = this.router.isActive(this.action?.link, true);
      }
    });
  }

  public handleLinkClick(action) {
    this.menuService.doNavigation(action);
  }
}
