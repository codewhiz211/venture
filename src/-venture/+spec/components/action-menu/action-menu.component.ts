import { Component, Input, OnDestroy } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs/operators';

import { AuthService } from '@auth/services/auth.service';
import { ClientModel } from '@interfaces/client-model';
import { ClientService } from 'src/-venture/+clients/services/client.service';
import { ClientSpec } from '@interfaces/client-spec.interface';
import { DrawerContent } from '@shell/drawer/drawer-content.type';
import { DrawerService } from '@shell/drawer/drawer.service';
import { ExportService } from '@shared/export/export.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestoreSnapshotComponent } from '@shell/drawer/restore-snapshot/restore-snapshot.component';
import { SPEC_TAB } from '@shared/config/constants';
import { ShareSpecComponent } from '@shell/drawer/share-spec/share-spec.component';
import { SpecAuditComponent } from '@shell/drawer/spec-audit/spec-audit.component';
import { SpecService } from '@services/spec/spec.service';
import { SpecTrackChangesComponent } from '@shell/drawer/spec-track-changes/spec-track-changes.component';
import { Subject } from 'rxjs';
import { TakeSnapshotComponent } from '@shell/drawer/take-snapshot/take-snapshot.component';
import { TrackingService } from '@services/spec/tracking.service';
import { sectionConfig } from '@shared/config/spec-config';

@Component({
  selector: 'ven-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss'],
})
export class ActionMenuComponent implements OnDestroy {
  @Input() selectedTab: number = SPEC_TAB.SPEC;
  @Input() activeSpec: ClientSpec;

  private destroy$ = new Subject();
  public isAdmin: boolean = this.authService.isAdmin;
  public SPEC_TAB = SPEC_TAB;

  constructor(
    private authService: AuthService,
    private drawerService: DrawerService,
    private exportService: ExportService,
    private spec: SpecService,
    public trackingService: TrackingService,
    private specService: SpecService,
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  takeSnapshot() {
    if (this.activeSpec == undefined) {
      return;
    }
    const currentSpec: any = this.spec.getActiveSpec();
    this.drawerService.open(
      new DrawerContent(TakeSnapshotComponent, {
        uid: currentSpec.uid,
        spec: currentSpec,
        quote: currentSpec.quote,
      })
    );
  }

  viewSnapshots() {
    if (this.activeSpec == undefined) {
      return;
    }
    const currentSpec = this.spec.getActiveSpec();
    this.drawerService.open(
      new DrawerContent(RestoreSnapshotComponent, {
        uid: currentSpec.uid,
        spec: currentSpec,
      })
    );
  }

  share() {
    if (this.activeSpec == undefined) {
      return;
    }
    // opens dialog for user to choose how to share
    const currentSpec: any = this.spec.getActiveSpec();
    this.drawerService.open(
      new DrawerContent(ShareSpecComponent, {
        uid: currentSpec.uid,
        spec: currentSpec,
        quote: currentSpec.quote,
      })
    );
  }

  showAudit() {
    if (this.activeSpec == undefined) {
      return;
    }
    const currentSpec: any = this.spec.getActiveSpec();
    this.drawerService.open(
      new DrawerContent(SpecAuditComponent, {
        uid: currentSpec.uid,
        sections: this.specService.addSectionsFromSpec(currentSpec, sectionConfig),
      })
    );
  }

  editSpec() {
    if (this.activeSpec == undefined) {
      return;
    }
    this.spec.editSpecMode();
  }

  onExportClick() {
    if (this.activeSpec == undefined) {
      return;
    }
    const currentSpec: any = this.spec.getActiveSpec();
    const initialSnackBar = this.snackBar;

    initialSnackBar.open('Syncing with Freedom…', undefined, { duration: 0 });
    this.clientService
      .getClientInfo(currentSpec.uid)
      .pipe(switchMap((client: ClientModel) => this.exportService.exportSpec(currentSpec, client.lot)))
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          initialSnackBar.dismiss();
          this.snackBar.open('Synced', undefined, { duration: 3000 });
        },
        (err) => {
          initialSnackBar.dismiss();
          this.snackBar.open('Sync failed, please try again', undefined, { duration: 3000 });
        }
      );
  }

  onTrackingClick() {
    if (this.activeSpec == undefined) {
      return;
    }
    if (this.trackingService.trackChangesEnabled) {
      this.drawerService.open(
        new DrawerContent(SpecTrackChangesComponent, {
          spec: this.activeSpec,
        })
      );
    } else {
      this.trackingService.enableTracking();
      this.trackingService.openTrackChangesSnackBar(this.activeSpec);
    }
  }
}
