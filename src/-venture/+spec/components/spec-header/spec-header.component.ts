import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';
import { ClientSpec } from '@interfaces/client-spec.interface';
import { ConfirmationDialogComponent } from '@shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { FieldConfig } from '../field-config.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnapshotService } from '@services/spec/snapshot.service';
import { SpecService } from '@services/spec/spec.service';
import { Subject } from 'rxjs';
import { WindowService } from '@services/window.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ven-spec-header',
  templateUrl: './spec-header.component.html',
  styleUrls: ['./spec-header.component.scss'],
})
export class SpecHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('statusDropdown', { static: true }) statusDropdown;

  @Input() spec: ClientSpec;

  public logoImage = '/assets/img/pdf-logo.png';
  isMobile = false;

  private destroy$ = new Subject();

  constructor(
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private windowService: WindowService,
    private snapshotService: SnapshotService,
    private specService: SpecService
  ) {}

  ngOnInit() {
    this.isMobile = this.windowService.isMobile;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public setToPostContract(data: any) {
    // if preContract, display confirm modal before changing to postContract
    if (data.previousValue !== 'Completed') {
      this.dialogService
        .open(ConfirmationDialogComponent, {
          data: {
            html:
              '<b>Once a client has been marked as prepared for contract, any non-standard spec changes will display in the Extras tab.</b>' +
              "<br />We'll also save a copy of the current Spec that you can Share or Review at a later date.",
          },
          dialogTitle: 'Are you sure?',
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((result) => {
          if (result) {
            // TODO consider refactoring so spec header does not call child method - not obvious and tightly coupled
            this.statusDropdown.sendRequest(data.changesToSave, data.value);
          } else {
            // TODO consider refactoring so spec header does not call child method - not obvious and tightly coupled
            this.statusDropdown.fieldControl.setValue(this.statusDropdown.previousValue);
          }
        });
    } else {
      // TODO consider refactoring so spec header does not call child method - not obvious and tightly coupled
      this.statusDropdown.sendRequest(data.changesToSave, data.value, data.previousValue);
    }
  }

  public showSnackBar({ value, previousValue }) {
    if (value === 'Prepared for contract' && previousValue !== 'Completed') {
      this.createSnapShot()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.snackBar.open('Snapshot created', undefined, {
            duration: 2000,
          });
        });
    } else if (value === 'Completed') {
      this.snackBar.open(`${this.spec.details.client} has been archived`, undefined, {
        duration: 2000,
      });
    }
  }

  private createSnapShot() {
    const currentSpec: any = this.specService.getActiveSpec();
    const { suggestions, ...specWithoutSuggestions } = currentSpec;
    const snapshotData: any = {
      spec: specWithoutSuggestions,
      description: 'Prepared for contract',
      created: Date.now(),
      createdBy: this.authService.authUser.email,
    };
    return this.snapshotService.saveSnapshot(currentSpec.uid, snapshotData);
  }
}
