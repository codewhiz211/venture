import { NavMenuItem, NavMenuService } from '@shell/nav-menu.service';

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchService } from '@services/search.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ven-application-chrome-header-title',
  templateUrl: './app-chrome-header-title.component.html',
  styleUrls: ['./app-chrome-header-title.component.scss'],
})
export class AppChromeHeaderTitleComponent {
  public activePage$: Observable<NavMenuItem>;
  public searchActive$: Observable<boolean>;

  constructor(private navMenuService: NavMenuService, private searchService: SearchService) {
    this.activePage$ = this.navMenuService.activeMenuItem$;
    this.searchActive$ = this.searchService.searchActive$.pipe(map((s) => s.open));
  }
}
