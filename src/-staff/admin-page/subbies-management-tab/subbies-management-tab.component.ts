import { Component, OnInit } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';

import { AdminService } from '../admin.service';
import { Column } from '@shared/components/ven-table/columns.interface';
import { Observable } from 'rxjs';
import { SubbieDetailComponent } from '@shared/components/subbie-detail/subbie-detail.component';
import { SubbieSummary } from 'src/-venture/+admin/services/subbie-summary.interface';

@Component({
  selector: 'ven-subbies-management-tab',
  templateUrl: './subbies-management-tab.component.html',
  styleUrls: ['./subbies-management-tab.component.scss'],
})
export class SubbiesManagementTabComponent implements OnInit {
  public subbie$: Observable<SubbieSummary[]>;
  public columns: Column[];
  constructor(private adminService: AdminService, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.subbie$ = this.adminService.subbie$;
    this.adminService.getAllSubbies();

    this.columns = [
      { accessor: 'name', label: 'Subbie', width: '25%', mobileWidth: '90%' },
      { accessor: 'users', label: 'Users', width: '65%', complex: 'multi-elements', fieldName: 'email', mobileWidth: '0%' },
      { accessor: 'edit', label: 'Edit', type: 'operator', icon: 'edit', width: '10%', mobileWidth: '10%' },
    ];
  }

  editSubbie(row) {
    this.dialogService.open(SubbieDetailComponent, {
      data: row,
      dialogTitle: 'Edit subbie',
      size: DialogSize.Large,
    });
  }
}
