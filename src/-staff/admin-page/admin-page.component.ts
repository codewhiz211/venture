import { Component, OnInit } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';

import { AppChromeDetailsPageFooterConfig } from '@shell/app-chrome-details-page-footer/app-chrome-details-page-footer.component';
import { AuthService } from '@auth/services/auth.service';
import { BaseComponent } from '@shared/components/base.component';
import { BuildManagementTabComponent } from './build-management-tab/build-management-tab.component';
import { DevTabComponent } from './dev-tab/dev-tab.component';
import { StaffDetailComponent } from '@shared/components/staff-detail/staff-detail.component';
import { StaffManagementTabComponent } from './staff-management-tab/staff-management-tab.component';
import { SubbieDetailComponent } from '@shared/components/subbie-detail/subbie-detail.component';
import { SubbiesManagementTabComponent } from './subbies-management-tab/subbies-management-tab.component';

@Component({
  selector: 'ven-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent extends BaseComponent implements OnInit {
  public headerConfig = {
    title: 'Admin',
  };

  public footerConfig: AppChromeDetailsPageFooterConfig;
  public contentConfig;

  public currentTab: string = 'build';

  constructor(private authService: AuthService, private dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.contentConfig = [
      {
        label: 'BUILDS',
        id: 'builds',
        component: BuildManagementTabComponent,
      },
      {
        label: 'STAFF',
        id: 'staff',
        component: StaffManagementTabComponent,
      },
      {
        label: 'SUBBIES',
        id: 'subbies',
        component: SubbiesManagementTabComponent,
      },
    ];

    if (this.authService.authUser.permissions.includes('developer')) {
      this.contentConfig.push({
        label: 'DEV',
        id: 'dev',
        component: DevTabComponent,
      });
    }

    this.footerConfig = {
      type: 'forceSpeedDial',
      actions: [
        {
          icon: 'add',
          label: () => 'Add',
          primary: true,
          shownOnDesktop: true,
          action: () => this.add(),
          tabs: ['staff', 'subbies'],
        },
      ],
    };
  }

  private add() {
    if (this.currentTab == 'staff') {
      this.dialogService.open(StaffDetailComponent, {
        data: {},
        dialogTitle: 'Add a new staff user',
        size: DialogSize.Large,
      });
    } else if (this.currentTab == 'subbies') {
      this.dialogService.open(SubbieDetailComponent, {
        dialogTitle: 'Add a new subbie',
        size: DialogSize.Large,
      });
    }
  }
}
