import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { filter, sort } from 'ramda';

import { Injectable } from '@angular/core';
import createLogger from 'debug';

const logger = createLogger('ven:common:menu');

export interface HeaderMenuItem {
  icon: string;
  label: string;
  order: number;
  method: any;
}

const sortMenuItems = (a, b) => (a.order > b.order ? 1 : -1);

// These items are displayed in the app bar overflow menu (desktop and mobile)

@Injectable({
  providedIn: 'root',
})
export class HeaderMenuService {
  private _menuItems: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly menuItems$: Observable<any> = this._menuItems.asObservable();

  constructor() {
    logger('HeaderMenuItems');
    this.menuItems$.subscribe((items) => logger(items));

    this._menuItems.next([]);
  }

  public addMenuItem(item: HeaderMenuItem) {
    const existingMenuItem = this._menuItems.value.find((i) => i.label === item.label);
    if (!existingMenuItem) {
      this._menuItems.next(sort(sortMenuItems, [...this._menuItems.getValue(), item]));
    }
  }

  public clear() {
    this._menuItems.next([]);
  }

  public removeMenuItem(label: string) {
    const sortedItems = pipe(
      filter((m) => m.label !== label),
      sort(sortMenuItems)
    )(this._menuItems.getValue());

    this._menuItems.next(sortedItems);
  }
}
