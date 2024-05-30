import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs/operators';

import { AuthService } from '@auth/services/auth.service';
import { ClientModel } from '@interfaces/client-model';
import { ClientService } from 'src/-venture/+clients/services/client.service';
import { ClientSpec } from '@interfaces/client-spec.interface';
import { DrawerContent } from '@shell/drawer/drawer-content.type';
import { DrawerService } from '@shell/drawer/drawer.service';
import { ExportService } from '@shared/export/export.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShareSpecComponent } from '@shell/drawer/share-spec/share-spec.component';
import { SpecAuditComponent } from '@shell/drawer/spec-audit/spec-audit.component';
import { SpecService } from '@services/spec/spec.service';
import { Subject } from 'rxjs';
import { TrackingService } from '@services/spec/tracking.service';
import { sectionConfig } from '@shared/config/spec-config';

@Component({
  selector: 'ven-spec-speed-dial',
  templateUrl: './spec-speed-dial.component.html',
  styleUrls: ['./spec-speed-dial.component.scss'],
})
export class SpecSpeedDialComponent implements AfterViewInit, OnDestroy {
  @Input() spec: ClientSpec;

  @Output() trackDialog = new EventEmitter();

  public fabButtonOpened = false;
  public isAdmin: boolean = this.authService.isAdmin;

  private destroy$ = new Subject();

  constructor(
    private specService: SpecService,
    private drawerService: DrawerService,
    public trackingService: TrackingService,
    private clientService: ClientService,
    private exportService: ExportService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  editModeMobile(trackMode?: boolean) {
    this.specService.editSpecMode(trackMode);
  }

  showTrackingDialog() {
    this.trackDialog.emit(true);
    if (this.spec && this.spec.disabled) {
      this.editModeMobile(true);
    }
  }

  showAudit() {
    const currentSpec: any = this.specService.getActiveSpec();
    this.drawerService.open(
      new DrawerContent(SpecAuditComponent, {
        uid: currentSpec.uid,
        sections: this.specService.addSectionsFromSpec(currentSpec, sectionConfig),
      })
    );
  }

  addNewSection() {
    this.specService.emitNewSection.emit();
  }

  clickListener() {
    this.fabButtonOpened = !this.fabButtonOpened;

    if (this.fabButtonOpened) {
      const listener = document.getElementsByTagName('body')[0];
      const func = () => {
        this.fabButtonOpened = false;
        listener.removeEventListener('click', func);
      };
      // add focus on button in safari browser
      document.getElementById('fab-speed-dial-mobile').focus();
      listener.addEventListener('click', func);
    }
  }

  onExportClick() {
    const currentSpec: any = this.specService.getActiveSpec();
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
}
