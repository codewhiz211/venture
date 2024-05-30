import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FullscreenService {
  fullscreen$: Observable<boolean>;

  constructor(private router: Router) {
    this.fullscreen$ = this.router.events.pipe(
      filter((event) => {
        return event instanceof NavigationEnd;
      }),
      map((event: NavigationEnd) => {
        const route: any = this.router.config.find((r) => {
          return '/' + r.path === event.url.split('?')[0];
        });

        console.log(route);

        return route && route.data?.fullscreen ? true : false;
      })
    );
  }
}
