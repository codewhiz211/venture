import { Component, Input } from '@angular/core';
import { NavMenuItem, NavMenuService } from '@shell/nav-menu.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'ven-application-chrome-side-nav-button',
  templateUrl: 'app-chrome-side-nav-button.component.html',
  styleUrls: ['app-chrome-side-nav-button.component.scss'],
})
export class AppChromeSidenavButtonComponent {
  @Input() action: NavMenuItem;
  @Input() top: boolean;

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
