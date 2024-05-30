import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { clone, omit } from 'ramda';

import { AdminService } from 'src/-staff/admin-page/admin.service';
import { BaseComponent } from '@shared/components/base.component';
import { ConfirmationDialogComponent } from '@shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '@shell/drawer/drawer.service';
import { EVENT_TYPES } from '@shell/drawer/drawer-content.interfaces';
import { EmailValidator } from '@shared/validators/email.validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ven-subbie-detail',
  templateUrl: './subbie-detail.component.html',
  styleUrls: ['./subbie-detail.component.scss'],
})

// TODO: better move to admin-page after old shell removed
export class SubbieDetailComponent extends BaseComponent implements OnInit {
  @Input() data;
  private originalData;
  public isEditing;
  private subbieUid;
  public loading: boolean = false;
  public subbieForm: FormGroup;
  public errorMessage;

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };
  public submitAction = {
    label: 'SAVE',
    handler: () => this.onSaveClick(),
  };

  constructor(
    private formBuilder: FormBuilder,
    private drawerService: DrawerService,
    private adminService: AdminService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.data) {
      //For editing
      this.originalData = this.data;
      const subbieFormData = {
        name: this.originalData.name,
        users: this.originalData.users.map((u) => omit(['subbieUid', 'role', 'preference', 'defaultPassword'], u)),
      };
      this.subbieUid = this.originalData.subbieUid;
      this.isEditing = true;
      this.subbieForm = this.formBuilder.group({
        name: ['', Validators.compose([Validators.required])],
        users: this.formBuilder.array([this.newUserFormControl(true)]),
      });
      const users = subbieFormData.users;
      //create formControl for multiple users, as we have already create a user control
      // in form array, we need to add some more user control for the rest users
      if (users.length > 1) {
        for (let i = 1; i < users.length; i++) {
          this.addUser();
        }
      }

      this.subbieForm.setValue(subbieFormData);
    } else {
      // For creating
      this.subbieForm = this.formBuilder.group({
        name: ['', Validators.compose([Validators.required])],
        users: this.formBuilder.array([this.newUserFormControl()]),
      });
    }
  }

  onCancelClick() {
    this.subbieForm.reset();
    this.dialogService.closeActiveDialog();
    this.drawerService.close();
  }

  onSaveClick() {
    this.loading = true;
    if (!this.isEditing) {
      this.adminService
        .createSubbie(this.subbieForm.value)
        .pipe(this.takeUntilDestroy())
        .subscribe((result) => {
          //get onboarding flow here;
          // this.onBoardingFlow();
          this.raiseChangedEvent();
          this.snackBar.open(`${this.subbieForm.value.name} has been created`);
          this.onCancelClick();
          this.adminService.getAllSubbies();
        });
    } else {
      //save editing
      const changedData = this.getChange();
      if (changedData.length > 0 || this.originalData.name != this.subbieForm.value.name) {
        this.adminService
          .editSubbie(this.getCurrentSubbie(), this.subbieUid, changedData)
          .pipe(this.takeUntilDestroy())
          .subscribe((result) => {
            this.raiseChangedEvent();
            this.snackBar.open(`${this.subbieForm.value.name} has been updated`);
            this.onCancelClick();
            this.adminService.getAllSubbies();
          });
      } else {
        this.loading = false;
        this.onCancelClick();
      }
    }
  }

  deleteSubbie() {
    this.dialogService
      .open(ConfirmationDialogComponent, {
        data: {
          html: 'This Subbie and all users will be deleted and will no longer have access to the Subbie app. This action cannot be undone.',
        },
        dialogTitle: 'Delete subbie',
      })
      .subscribe((result) => {
        if (result) {
          this.loading = true;
          //delete subbie here. Only delete subbie and the users under it. But jobs will be kept.
          this.adminService.deleteSubbie(this.subbieUid).subscribe((res) => {
            this.raiseChangedEvent();
            this.snackBar.open(`${this.subbieForm.value.name} has been deleted`);
            this.onCancelClick();
            this.adminService.getAllSubbies();
          });
        }
      });
  }

  private raiseChangedEvent() {
    this.drawerService.raiseEvent(EVENT_TYPES.subbieEdited);
    this.loading = false;
  }

  //as formControl value can't get values of disabled form data.
  private getCurrentSubbie() {
    const currentSubbie = clone(this.subbieForm.value);
    currentSubbie.users = currentSubbie.users.map((user) => {
      let cUser;
      this.originalData.users.forEach((oUser) => {
        if (user.uid === oUser.uid) {
          cUser = oUser;
          cUser.name = user.name;
        } else if (user.uid == null) {
          cUser = user;
        }
      });
      return cUser;
    });
    return currentSubbie;
  }

  private getChange() {
    const currentUsers = this.subbieForm.value.users;
    const changes = [];
    currentUsers.forEach((cUser) => {
      if (cUser.uid == undefined) {
        changes.push({ value: cUser, type: 'add' });
      }
    });
    this.originalData.users.forEach((oUser) => {
      let isDeleted = true;
      currentUsers.forEach((cUser) => {
        if (cUser.uid == oUser.uid) {
          isDeleted = false;
          if (cUser.name !== oUser.name) {
            changes.push({ value: cUser, type: 'updateName' });
          }
        }
      });
      if (isDeleted) {
        changes.push({ value: oUser, type: 'remove' });
      }
    });
    return changes;
  }

  public addUser(addChanged = undefined) {
    const users = this.subbieForm.get('users') as FormArray;
    const newUserControl = this.isEditing && !addChanged ? this.newUserFormControl(true) : this.newUserFormControl();
    users.push(newUserControl);
  }

  public removeUser(i) {
    const users = this.subbieForm.get('users') as FormArray;
    users.removeAt(i);
  }

  private newUserFormControl(disabled = false): FormGroup {
    return this.formBuilder.group({
      uid: [],
      name: ['', Validators.compose([Validators.required])],
      email: [{ value: '', disabled: disabled }, Validators.compose([Validators.required, EmailValidator.isValid])],
      isOnboard: [{ value: false, disabled: disabled }],
    });
  }

  public onBoardingFlow() {
    alert('onBoardingFlow');
  }
}
