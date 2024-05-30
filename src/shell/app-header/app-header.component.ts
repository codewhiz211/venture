import { Component, ViewChild, Inject } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';
import { AuthUser } from '@auth/types';
import { ClientSpec } from '@interfaces/client-spec.interface';

import { DrawerContent } from '../drawer/drawer-content.type';
import { DrawerService } from '../drawer/drawer.service';
import { Location } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';
import { RestoreSnapshotComponent } from '../drawer/restore-snapshot/restore-snapshot.component';
import { Router } from '@angular/router';
import { SPEC_TAB } from '@shared/config/constants';
import { ShareSpecComponent } from '../drawer/share-spec/share-spec.component';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecService } from '@services/spec/spec.service';
import { TakeSnapshotComponent } from '../drawer/take-snapshot/take-snapshot.component';
import { TrackingService } from '@services/spec/tracking.service';
import createLogger from 'debug';
import { APP_CONFIG } from 'app.config';
import { SpecTrackChangesComponent } from '@shell/drawer/spec-track-changes/spec-track-changes.component';

const logger = createLogger('ven:staff');

@Component({
  selector: 'ven-application-header',
  templateUrl: 'app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  public selectedTab: number = SPEC_TAB.SPEC;

  private config;

  title = '';
  showAdmin = false;
  showSpec = false;
  isAuthenticated = false;
  logoImage: string;
  client: string;
  version;
  hideOption: boolean;
  hideLogo: boolean;
  userEmail: string;
  showHeader: boolean = false;

  constructor(
    @Inject(APP_CONFIG) config,
    public authService: AuthService,
    private drawerService: DrawerService,
    public specService: SpecService,
    private router: Router,
    private trackingService: TrackingService,
    private specActiveService: SpecActiveService,
    location: Location
  ) {
    this.config = config;

    router.events.subscribe((val) => {
      if (this.authService.isAdmin && location.path().indexOf('admin') === -1) {
        this.showAdmin = true;
      } else if (this.authService.isAdmin) {
        this.showSpec = true;
      } else {
        this.showAdmin = this.showSpec = false;
      }

      // temporary fix to ensure that header not shown over top of new login background
      // this is required due to tweak needed to support safari not supporting background position fixed properly
      this.showHeader = !location.path().includes('login') && !location.path().includes('forgot-password');
      this.hideLogo = location.path().includes('change-password');
    });
    this.version = this.config.version;
    this.isAuthenticated = this.authService.isAuthenticated;
    this.logoImage = '/assets/img/logo.svg';

    this.specActiveService.activeSpec$.subscribe((spec: ClientSpec) => {
      this.client = spec ? spec.contact_details.client : '';
      if (spec && spec.hasOwnProperty('disabled')) {
        this.hideOption = spec.disabled;
      }
    });

    this.specActiveService.selectedTab$.subscribe((idx) => {
      this.selectedTab = idx;
    });

    this.authService.authUser$.subscribe((user) => {
      const authUser = user as AuthUser;
      this.userEmail = authUser ? authUser.email.split('@')[0] : null;
    });
  }

  closeMenu() {
    this.trigger.closeMenu();
  }

  goToClients() {
    if (this.trackingService.trackChangesEnabled) {
      this.warnUserAboutLosingTrackedChanges();
    } else {
      this.router.navigate(['/venture/clients']);
    }
  }

  addNewSection() {
    this.specService.emitNewSection.emit();
  }

  takeSnapshot() {
    const currentSpec: any = this.specService.getActiveSpec();
    this.drawerService.open(
      new DrawerContent(TakeSnapshotComponent, {
        uid: currentSpec.uid,
        spec: currentSpec,
        quote: currentSpec.quote,
      })
    );
  }

  viewSnapshots() {
    const currentSpec = this.specService.getActiveSpec();
    this.drawerService.open(
      new DrawerContent(RestoreSnapshotComponent, {
        uid: currentSpec.uid,
        spec: currentSpec,
      })
    );
  }

  shareSpec() {
    const currentSpec: any = this.specService.getActiveSpec();
    this.drawerService.open(
      new DrawerContent(ShareSpecComponent, {
        uid: currentSpec.uid,
        spec: currentSpec,
        quote: currentSpec.quote,
      })
    );
  }

  onAdmin() {
    this.specService.clearActiveSpec();
    this.router.navigate(['/venture/admin']);
  }

  onLogout() {
    this.authService.authUser$.subscribe((authState) => {
      if (!authState) {
        logger('onLogout (!authState) => goto login');
        this.router.navigate(['/venture/login']);
      }
    });
    this.authService.logout();
    this.specService.clearActiveSpec();
  }

  private warnUserAboutLosingTrackedChanges() {
    this.trackingService
      .showAlertDialog()
      .afterClosed()
      .subscribe((res: string) => {
        switch (res) {
          case 'exit':
            this.trackingService.disableTracking();
            this.router.navigate(['/venture/clients']);
            break;
          case 'view':
            this.drawerService.open(
              new DrawerContent(SpecTrackChangesComponent, {
                spec: this.specService.getActiveSpec(),
              })
            );
            break;
          case 'resume':
          default:
            break;
        }
      });
  }
}
