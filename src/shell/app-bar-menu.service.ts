import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { filter, sort } from 'ramda';

import { Injectable } from '@angular/core';
import { ReleaseNoteService } from '@services/release-notes.service';
import createLogger from 'debug';

const logger = createLogger('ven:common:menu');

export interface AppBarMenuItem {
  badge?: number;
  icon: string;
  label: string;
  order: number;
  method: any;
}

const sortMenuItems = (a, b) => (a.order > b.order ? 1 : -1);

// These items are displayed in the app bar (desktop and mobile)

@Injectable({
  providedIn: 'root',
})
export class AppBarMenuService {
  private _menuItems: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly menuItems$: Observable<any> = this._menuItems.asObservable();

  constructor(private releaseNotesService: ReleaseNoteService) {
    logger('AppBarMenuItems');
    this.menuItems$.subscribe((items) => logger(items));
  }

  public addMenuItem(item: AppBarMenuItem, replace: boolean = false) {
    const menuItems = this._menuItems.value;

    const existingMenuItem = menuItems.find((i) => i.label === item.label);
    if (!existingMenuItem) {
      this._menuItems.next(sort(sortMenuItems, [...menuItems, item]));
    } else if (replace) {
      // remove existing and add new
      const without: any = this.removeItem(menuItems, item.label);
      this._menuItems.next(sort(sortMenuItems, [...without, item]));
    }
  }

  public clear() {
    this._menuItems.next([]);
  }

  public removeMenuItem(label: string) {
    this._menuItems.next(this.removeItem(this._menuItems.getValue(), label));
  }

  private removeItem(menuItems, label: string) {
    return pipe(
      filter((m) => m.label !== label),
      sort(sortMenuItems)
    )(menuItems);
  }
}
