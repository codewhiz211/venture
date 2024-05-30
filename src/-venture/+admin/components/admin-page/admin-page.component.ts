import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { filter as ramdaFilter, map as ramdaMap } from 'ramda';

import { AdminService } from '../../services/admin.service';
import { ClientService } from '../../../+clients/services/client.service';
import { ClientSummary } from '@interfaces/client-summary.interface';
import { ConfirmationDialogComponent } from '@shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerContent } from '@shell/drawer/drawer-content.type';
import { DrawerService } from '@shell/drawer/drawer.service';
import { EVENT_TYPES } from '@shell/drawer/drawer-content.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StaffDetailComponent } from '../../../../shared/components/staff-detail/staff-detail.component';
import { SubbieDetailComponent } from '@shared/components/subbie-detail/subbie-detail.component';
import { SubbieSummary } from '../../services/subbie-summary.interface';
import { UserSummary } from '../../services/user-summary.interface';
import { UserType } from '@auth/roles';
import { WindowService } from '@services/window.service';
import { adminLogger } from '../../admin.logger';
import createLogger from 'debug';
import { displayedPermissions } from '@shared/components/subbie-detail/constants';

const logger = createLogger('ven:staff');

@Component({
  selector: 'ven-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
  public clients$: Observable<ClientSummary[]>;
  public users$: Subject<UserSummary[]>;
  public subbies$: Observable<SubbieSummary[]>;
  private usersRequest$: Observable<UserSummary[]>;

  public isMobile = false;
  public loading = undefined;
  public usersTabSelected: boolean = false;
  public subbiesTabSelected: boolean = false;

  public buildColumns;
  public userColumns;
  public subbieColumns;

  public subbieFilterAction;

  constructor(
    public dialogService: DialogService,
    private snackBar: MatSnackBar,
    private windowService: WindowService,
    private clientService: ClientService,
    private adminService: AdminService,
    private drawerService: DrawerService
  ) {
    this.clients$ = new ReplaySubject(1);
    this.users$ = new ReplaySubject(1);
    this.isMobile = this.windowService.isMobile;
  }

  ngOnInit() {
    this.clients$ = this.clientService.clients$;
    this.drawerService.events$.subscribe((event) => {
      if (event.type === EVENT_TYPES.userAdded) {
        this.getUsers(true);
      } else if (event.type === EVENT_TYPES.userEdited) {
        this.getUsers(true);
      } else if (event.type === EVENT_TYPES.userDeleted) {
        this.handleUserDeleteClicked(event.data);
        this.getUsers(true);
      } else if (event.type === EVENT_TYPES.userPermissionsUpdated) {
        this.getUsers(true);
        this.drawerService.close();
      } else if (event.type === EVENT_TYPES.subbieAdded || event.type === EVENT_TYPES.subbieEdited) {
        this.getUsers(true);
        this.getSubbies();
      }
    });

    this.clientService.getClients(true);
    this.getUsers(false);
    this.getSubbies();
    this.createTableColumns();
    //for search subbie with user email
    this.subbieFilterAction = (data, filter) => {
      return data.name.toLowerCase().includes(filter) || data.users.filter((user) => user.email.includes(filter)).length != 0;
    };
  }

  handleTabChange(selectedTab) {
    this.usersTabSelected = selectedTab.index === 1;
    this.subbiesTabSelected = selectedTab.index === 2;
  }

  createTableColumns() {
    this.buildColumns = [
      { accessor: 'lot', label: 'Lot#', width: '30%' },
      { accessor: 'client', label: 'Client', width: '30%' },
      { accessor: 'lastModified', label: 'Last Modified', width: '30%', format: 'shortDate' },
      { accessor: 'delete', label: 'Delete', type: 'operator', icon: 'delete', width: '10%' },
    ];
    this.userColumns = this.isMobile
      ? [
          { accessor: 'name', label: 'User', width: '90%' },
          { accessor: 'edit', label: 'Edit', type: 'operator', icon: 'edit', width: '10%' },
        ]
      : [
          { accessor: 'name', label: 'User', width: '25%' },
          {
            accessor: 'permissions',
            label: 'Permissions',
            width: '65%',
            complex: 'multi-elements',
            adapter: displayedPermissions,
            wrap: 'chip',
          },
          { accessor: 'edit', label: 'Edit', type: 'operator', icon: 'edit', width: '10%' },
        ];
    this.subbieColumns = [
      { accessor: 'name', label: 'Subbie', width: '90%', complex: 'parent-children', children: 'users', fieldName: 'email' },
      { accessor: 'edit', label: 'Edit', type: 'operator', icon: 'edit', width: '10%' },
    ];
  }

  getUsers(refresh) {
    if (refresh || !this.usersRequest$) {
      this.usersRequest$ = this.adminService.getUsers();

      this.usersRequest$
        //.pipe(
        //tap((users) => logger(users)),
        //filter((users) => ramdaFilter((user) => user.role === UserType.Staff, users)),
        //map((staffUsers) => ramdaMap((staff) => (staff.permissions ? staff : { ...staff, permissions: [] }), staffUsers))
        //
        .subscribe(
          async (result) => {
            // TODO move this into pipe above (currently it does not filter on role correctly)
            const staffUsers = ramdaFilter((user) => user.role === UserType.Staff, result);
            const staffUsersWithPermissions = ramdaMap((staff) => (staff.permissions ? staff : { ...staff, permissions: [] }), staffUsers);
            logger(staffUsersWithPermissions);
            return this.users$.next(staffUsersWithPermissions);
          },
          (err) => this.users$.error(err)
        );
    }
    return this.users$.asObservable();
  }

  getSubbies() {
    this.subbies$ = this.adminService.getAllSubbies();
  }

  handleAddNewUser() {
    this.drawerService.open(new DrawerContent(StaffDetailComponent, {}));
  }

  handleAddNewSubbie() {
    this.drawerService.open(new DrawerContent(SubbieDetailComponent, {}));
  }

  handleSubbieEdit(subbie) {
    adminLogger('handleEditingClicked', subbie);
    this.drawerService.open(new DrawerContent(SubbieDetailComponent, { subbie }));
  }

  async handleUserRowClicked(row) {
    // open a side drawer with user details to allow view/edit

    this.drawerService.open(new DrawerContent(StaffDetailComponent, row));
  }

  handleUserRoleChange(row) {
    this.loading = 'Updating Role';
    //TODO: update user role
    // this.adminService.updateRole(row.uid, row.isAdmin).subscribe(
    //   () => {
    //     this.clientService.getClients(true);
    //     this.loading = undefined;
    //     this.snackBar.open('User role changed');
    //   },
    //   (err) => {
    //     this.snackBar.open('Roel change FAILED');
    //     this.loading = undefined;
    //     console.error(err.message);
    //   }
    // );
  }

  handleClientDeleteClicked(row) {
    // tslint:disable-next-line
    const message = `Deleting will permanently remove the record for <i>${row.client}</i><br />This action can not be undone.`;
    this.showConfirmationDialog(message).subscribe((result) => {
      if (result) {
        this.loading = 'Deleting Client';
        this.adminService.deleteClient(row.uid).subscribe(
          () => {
            this.clientService.getClients(true);
            this.snackBar.open('Client deleted');
            this.loading = undefined;
          },
          (err) => {
            this.snackBar.open('Client deletion FAILED');
            this.loading = undefined;
            console.error(err.message);
          }
        );
      }
    });
  }

  handleUserDeleteClicked(row) {
    const message = `<i>${row.email}</i> will no longer be able to access the Spec Sheet App.`;
    this.showConfirmationDialog(message).subscribe((result) => {
      if (result) {
        this.loading = 'Deleting User';
        this.adminService.deleteUser(row.uid).subscribe(
          () => {
            this.getUsers(true);
            this.snackBar.open('User deleted');
            this.loading = undefined;
          },
          (err) => {
            this.snackBar.open('User deletion FAILED');
            this.loading = undefined;
            console.error(err.message);
          }
        );
      }
    });
  }

  showConfirmationDialog(message: string) {
    return this.dialogService.open(ConfirmationDialogComponent, {
      data: {
        html: message,
      },
      dialogTitle: 'Are you sure?',
    });
  }
}
