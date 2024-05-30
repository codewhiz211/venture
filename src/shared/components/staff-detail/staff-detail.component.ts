import { AvailablePermissions, DefaultPermissions, displayedPermissions } from '../subbie-detail/constants';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { skipWhile, switchMap } from 'rxjs/operators';

import { AdminService } from 'src/-staff/admin-page/admin.service';
import { BaseComponent } from '../base.component';
import { ConfirmationDialogComponent } from '@shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '@shell/drawer/drawer.service';
import { EVENT_TYPES } from '@shell/drawer/drawer-content.interfaces';
import { EmailValidator } from '@shared/validators/email.validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../interfaces/user.interface';
import { UserType } from '@auth/roles';
import { environment } from '../../../environments/environment';
import { omit } from 'ramda';
import { sharedAdminLogger } from '@shared/shared.loger';

@Component({
  selector: 'ven-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.scss'],
})
// TODO: better move to admin-page after old shell removed
export class StaffDetailComponent extends BaseComponent implements OnInit {
  @Input() data: any;
  @Output() itemAdded = new EventEmitter();

  public userForm: FormGroup;
  public loading = false;
  public isEditing = false;
  public errorMessage = '';
  public userType = UserType;
  public permissionsField = AvailablePermissions;
  public displayedPermissions = displayedPermissions;

  public submitAction = {
    label: 'SAVE',
    handler: () => this.onSaveClick(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };

  constructor(
    private drawerService: DrawerService,
    private dialogService: DialogService,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    super();
    this.userForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      name: ['', Validators.compose([Validators.required])],
      permissions: this.formBuilder.array(this.createFormArray()),
    });
  }

  ngOnInit() {
    sharedAdminLogger('data', this.data);
    if (this.data.uid) {
      this.isEditing = true;
      const userInfo = omit(['uid', 'role'], this.data);
      if (userInfo.permissions) {
        userInfo.permissions = this.permissionsField.map((p) => userInfo.permissions.includes(p));
      } else {
        userInfo.permissions = [false, false, false, false, false];
      }
      sharedAdminLogger('userInfo', userInfo);
      this.userForm.setValue(userInfo);
      this.userForm.get('email').disable();
      sharedAdminLogger('userFormData', this.userForm.value);
    }
  }

  onSaveClick() {
    this.loading = true;
    this.errorMessage = '';
    const formValue = this.userForm.getRawValue();
    const email = formValue.email;
    const name = formValue.name;
    const permissions = this.permissionsField.filter((permission, i) => formValue.permissions[i]);
    sharedAdminLogger('permissions', permissions);

    if (this.isEditing) {
      this.adminService
        .editStaff(this.data.uid, { name, permissions })
        .subscribe((result) => this.afterUploadingData(result), this.handleError);
    } else {
      const user: User = {
        email,
        name,
        role: UserType.Staff,
      };
      this.adminService
        .addStaff(user)
        .pipe(
          switchMap((user: any) => {
            sharedAdminLogger('user', user);
            return this.adminService.addPermissions(user.uid, permissions);
          })
        )
        .subscribe((result: any) => {
          this.afterUploadingData(result);
        }, this.handleError);
    }
  }

  //create permission form control arrays from AvailablePermissions and DefaultPermissions
  private createFormArray() {
    return this.permissionsField.map((permission) => new FormControl(DefaultPermissions.includes(permission)));
  }

  private afterUploadingData(result) {
    sharedAdminLogger('result', result);
    this.loading = false;
    if (this.isEditing) {
      this.snackBar.open(`${this.userForm.value.name} has been updated.`);
      this.drawerService.raiseEvent(EVENT_TYPES.userEdited);
    } else {
      this.snackBar.open(`${this.userForm.value.name} has been added.`);
      this.drawerService.raiseEvent(EVENT_TYPES.userAdded);
    }
    this.adminService.getStaff();
    this.onCancelClick();
  }

  private handleError(error) {
    if (environment.production) {
      this.errorMessage = 'Failed to create user';
    } else {
      this.errorMessage = error.message ? error.message : error.toString();
    }
  }

  onCancelClick() {
    this.userForm.reset();
    // this.drawerService.close();
    this.dialogService.closeActiveDialog();
  }

  onDeleteClick() {
    const message = `<i>${this.data.email}</i> will no longer be able to access the Spec Sheet App.`;

    // this.drawerService.raiseEvent(EVENT_TYPES.userDeleted, { uid: this.data.uid, email: this.data.email });
    this.dialogService
      .open(ConfirmationDialogComponent, { data: { html: message }, dialogTitle: 'Delete user' })
      .pipe(
        this.takeUntilDestroy(),
        skipWhile((v) => !v)
      )
      .subscribe((result) => {
        if (result) {
          this.adminService.deleteStaff(this.data.uid).subscribe(
            () => {
              this.snackBar.open(`${this.userForm.value.name} has been deleted`);
              this.adminService.getStaff();
              this.onCancelClick();
            },
            (err) => {
              this.snackBar.open('User deletion FAILED');
              console.error(err.message);
            }
          );
        } else {
          this.onCancelClick();
        }
      });
  }
}
