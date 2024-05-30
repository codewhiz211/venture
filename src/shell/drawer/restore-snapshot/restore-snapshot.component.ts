import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { ConfirmationPhraseDialogComponent } from '@shared/dialogs/confirmation-phrase-dialog/confirmation-phrase-dialog.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '../drawer.service';
import { FormGroup } from '@angular/forms';
import { IDrawerContentComponent } from '../drawer-content.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { SnapshotService } from '@services/spec/snapshot.service';
import { SpecService } from '@services/spec/spec.service';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-restore-snapshot',
  templateUrl: './restore-snapshot.component.html',
  styleUrls: ['./restore-snapshot.component.scss'],
})
export class RestoreSnapshotComponent implements IDrawerContentComponent, OnInit {
  @Input() data: any;

  public snapshotForm: FormGroup;
  public errorMessage = '';
  public snapshotSelected = undefined;
  public specSnapshots = [];

  public isMobile = false;
  public loading: boolean = true;

  public submitAction = {
    label: 'RESTORE',
    handler: () => this.onRestoreClick(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private windowService: WindowService,
    private drawerService: DrawerService,
    private dialogService: DialogService,
    private snapshotService: SnapshotService,
    private specService: SpecService
  ) {}

  ngOnInit(): void {
    this.snapshotService.getSnapshots(this.data.uid).subscribe((snapshots) => {
      // For some reason, intermittently, but more often than not,
      // Angular does not pick up the change in loading state,
      // so the loading screen never gets removed (despite data existing)
      // use CDF to force a check.
      this.cd.markForCheck();
      this.loading = false;
      this.specSnapshots = snapshots;
    });

    this.isMobile = this.windowService.isMobile;
  }

  radioChange(event) {
    this.snapshotSelected = event.value;
  }

  onTileClick(snapshot) {
    this.snapshotSelected = snapshot;
    this.onRestoreClick();
  }

  onRestoreClick() {
    this.errorMessage = '';

    const dialogRef = this.dialog.open(ConfirmationPhraseDialogComponent, {
      panelClass: 'full-width-dialog',
      width: this.isMobile ? '100%' : '50%',
      data: { client: this.data.spec.details.client, snapshot: this.snapshotSelected },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.snapshotService.restoreSnapshot(this.data.uid, this.snapshotSelected.uid).subscribe(
          () => {
            this.loading = false;
            this.specService.getClientSpecAndSuggestions(this.data.uid);
            this.onCancelClick();
            setTimeout(() => this.snapshotService.signalRefresh(), 0);
          },
          (error) => {
            this.loading = false;
            this.errorMessage = error.message ? error.message : error.toString();
          }
        );
      }
    });
  }

  onCancelClick() {
    this.drawerService.close();
    this.dialogService.closeActiveDialog();
  }
}
