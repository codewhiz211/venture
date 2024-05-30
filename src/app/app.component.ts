import * as firebase from 'firebase/app';

import { AuthService } from '@auth/services/auth.service';
import { AuthUser } from '@auth/types';
import { Component, Inject } from '@angular/core';
import { HeaderMenuService } from '@shell/header-menu.service';
import { SwUpdate } from '@angular/service-worker';
import { WindowService } from '@services/window.service';

import { APP_CONFIG } from 'app.config';
import { firebaseConfig } from 'src/config/firebase.config';
import { ReleaseNoteService } from '@services/release-notes.service';
import { AppBarMenuService } from '@shell/app-bar-menu.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';

firebase.initializeApp(firebaseConfig);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public user: AuthUser;
  public showNewShell: boolean = false;
  public isSafari: boolean = false;

  private config;

  constructor(
    public authService: AuthService,
    private windowService: WindowService,
    private headerMenuService: HeaderMenuService,
    private swUpdate: SwUpdate,
    private router: Router,
    private location: Location,
    @Inject(APP_CONFIG) config
  ) {
    this.isSafari = this.windowService.isSafari();
    this.config = config;
  }

  ngOnInit() {
    //for avoiding that venture/** is inserted into new shell
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.tempChooseShell(event.url);
    });

    this.authService.authUser$.subscribe((authUser) => {
      this.user = authUser as AuthUser;

      if (this.user) {
        this.headerMenuService.addMenuItem({
          icon: 'lock',
          label: 'Logout',
          order: 2,
          method: () => this.authService.logout(),
        });
        if (this.user.permissions?.includes('admin')) {
          this.headerMenuService.addMenuItem({
            icon: 'people',
            label: 'Admin',
            order: 1,
            method: () => this.navToAdmin(), //Navigate to /staff/admins
          });
        } else {
          this.headerMenuService.removeMenuItem('Admin');
        }
      }
    });
    if (this.isSafari) {
      this.windowService.addBodyClass('safari');
    } else {
      this.windowService.removeBodyClass('safari');
    }

    if (this.config.serviceWorker) {
      if (this.swUpdate.isEnabled) {
        this.swUpdate.available.subscribe(() => {
          if (confirm('New version available. Load New Version?')) {
            window.location.reload();
          }
        });
      }
    }

    // TEMP disable
    // this.releaseNoteService.releaseCount$.subscribe((count) => {
    //   this.appBarMenuService.addMenuItem(
    //     {
    //       icon: 'notifications',
    //       badge: count,
    //       order: -1,
    //       label: 'Notifications',
    //       method: () => this.releaseNoteService.toggleReleaseNotes(),
    //     },
    //     true
    //   );
    // });

    //TEMP DISABLE this.releaseNoteService.getNewReleaseNoteCount();
  }

  public logout() {
    this.authService.logout();
  }

  private tempChooseShell(url) {
    this.showNewShell = url.includes('subbies') || url.includes('staff') || url.includes('venture/403'); //TEMP

    if (this.showNewShell) {
      this.windowService.addBodyClass('new-shell');
      this.windowService.removeBodyClass('old-shell');
    } else {
      this.windowService.addBodyClass('old-shell');
      this.windowService.removeBodyClass('new-shell');
    }
  }

  private navToAdmin() {
    const detailsPageRegex = /[a-zA-Z]*\/[a-zA-Z]*\/-\w*/;
    const currentPath = this.location.path();
    const replaceUrl = detailsPageRegex.test(currentPath);
    this.router.navigate(['staff', 'admin'], { replaceUrl });
  }
}
