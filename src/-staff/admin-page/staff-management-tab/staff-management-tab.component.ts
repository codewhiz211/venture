import { Component, OnInit } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';

import { AdminService } from '../admin.service';
import { BaseComponent } from '@shared/components/base.component';
import { Column } from '@shared/components/ven-table/columns.interface';
import { Observable } from 'rxjs';
import { StaffDetailComponent } from '@shared/components/staff-detail/staff-detail.component';
import { UserSummary } from 'src/-venture/+admin/services/user-summary.interface';
import { displayedPermissions } from '@shared/components/subbie-detail/constants';

@Component({
  selector: 'ven-staff-management-tab',
  templateUrl: './staff-management-tab.component.html',
  styleUrls: ['./staff-management-tab.component.scss'],
})
export class StaffManagementTabComponent extends BaseComponent implements OnInit {
  public staffs$: Observable<UserSummary[]>;
  public columns: Column[];

  constructor(private adminService: AdminService, private dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.staffs$ = this.adminService.staffs$;
    this.adminService.getStaff();
    this.columns = [
      { accessor: 'name', label: 'User', width: '25%', mobileWidth: '90%' },
      {
        accessor: 'permissions',
        label: 'Permissions',
        width: '65%',
        mobileWidth: '0%',
        complex: 'multi-elements',
        adapter: displayedPermissions,
      },
      { accessor: 'edit', label: 'Edit', type: 'operator', icon: 'edit', width: '10%', mobileWidth: '10%' },
    ];
  }

  editStaff(row) {
    this.dialogService.open(StaffDetailComponent, {
      data: row,
      dialogTitle: 'Edit staff user',
      size: DialogSize.Large,
    });
  }
}
