import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@auth/services/auth.service';
import { AuthUser } from '@auth/types';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '../drawer.service';
import { SnapshotService } from '@services/spec/snapshot.service';

@Component({
  selector: 'ven-take-snapshot',
  templateUrl: './take-snapshot.component.html',
  styleUrls: ['./take-snapshot.component.scss'],
})
export class TakeSnapshotComponent implements OnInit {
  @Input() data: any;

  public snapshotForm: FormGroup;
  public storeName: string;
  public loading = false;
  public errorMessage = '';

  public submitAction = {
    label: 'SAVE',
    handler: () => this.onSaveClick(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };

  constructor(
    private authService: AuthService,
    private drawerService: DrawerService,
    private dialogService: DialogService,
    private snapshotService: SnapshotService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.snapshotForm = this.formBuilder.group({
      description: ['', Validators.compose([Validators.required])],
    });
  }

  onSaveClick() {
    this.loading = true;
    this.errorMessage = '';
    const { suggestions, ...specWithoutSuggestions } = this.data.spec;
    const snapshotData: any = {
      spec: specWithoutSuggestions,
      description: this.snapshotForm.value.description,
      created: Date.now(),
      createdBy: (this.authService.authUser as AuthUser).email,
    };

    // when save update the quote on the spec and refresh local spec
    this.snapshotService.saveSnapshot(this.data.uid, snapshotData).subscribe(
      () => {
        this.loading = false;
        this.onCancelClick();
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error.message ? error.message : error.toString();
      }
    );
  }

  onCancelClick() {
    this.snapshotForm.reset();
    this.drawerService.close();
    this.dialogService.closeActiveDialog();
  }
}
