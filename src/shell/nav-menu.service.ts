import { BehaviorSubject, Observable, pipe } from 'rxjs';

import { AuthService } from '@auth/services/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import createLogger from 'debug';
import { sort } from 'ramda';

const logger = createLogger('ven:common:menu');

export interface NavMenuItem {
  icon: string;
  label: string;
  link: string;
  order: number;
  hideMobile?: boolean; // mobile (header)
}

// These items are displayed in the side nav (desktop) bottom nav (mobile)

const sortMenuItems = (a, b) => (a.order > b.order ? 1 : -1);

@Injectable({
  providedIn: 'root',
})
export class NavMenuService {
  private _menuItems: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly menuItems$: Observable<any> = this._menuItems.asObservable();

  private _activeMenuItem: BehaviorSubject<NavMenuItem> = new BehaviorSubject(null);
  public readonly activeMenuItem$: Observable<NavMenuItem> = this._activeMenuItem.asObservable();

  constructor(private authService: AuthService, private router: Router) {}

  init() {
    logger('NavMenuItems');

    this.menuItems$.subscribe((items) => logger(items));

    const orderedMenuItems = sort(sortMenuItems, this.getMenuItemsForApp());

    this._menuItems.next(orderedMenuItems);

    // start with first menu item

    const first = orderedMenuItems[0];

    if (first && !this.authService.isStaff) {
      this._activeMenuItem.next(first);
    }
  }

  clear() {
    this._activeMenuItem.next(null);
    this._menuItems.next(null);
  }

  public doNavigation(action) {
    this._activeMenuItem.next(action);
    this.router.navigate([action.link]);
  }

  private getMenuItemsForApp() {
    if (!this.authService.isAuthenticated) {
      return [];
    }

    if (this.authService.isClient) {
      return [];
    }

    if (this.authService.isSubbie) {
      return [
        { order: 0, label: 'Home', icon: 'home', link: '/subbies/home', hideMobile: true },
        { order: 1, label: 'Jobs', icon: 'handyman', link: '/subbies/jobs' },
        { order: 2, label: 'Schedule', icon: 'event_note', link: '/subbies/schedule' },
      ];
    }

    if (this.authService.isStaff) {
      const menuItemUnderPermission = {
        CRM: { order: 1, label: 'CRM', icon: 'sell', link: '/staff/crm' },
        builds: { order: 2, label: 'Builds', icon: 'handyman', link: '/staff/builds' },
        schedule: { order: 3, label: 'Schedule', icon: 'event_note', link: '/staff/schedule' },
        pricing: { order: 4, label: 'Pricing', icon: 'request_quote', link: '/staff/pricing' },
        reporting: { order: 5, label: 'Reporting', icon: 'assessment', link: '/staff/reporting' },
      };

      const menuItems = this.authService.authUser.permissions
        .filter((permission) => permission != 'admin')
        .map((permission) => menuItemUnderPermission[permission])
        .filter((permission) => permission != undefined); // hidden permissions not shown in UI

      return this.authService.isStaff
        ? [{ order: 0, label: 'HOME', icon: 'home', link: '/staff/home', hideMobile: true }, ...menuItems]
        : menuItems;
    }
  }
}
