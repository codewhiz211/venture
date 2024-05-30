import { RouterModule, Routes } from '@angular/router';

import { AdminPageComponent } from './admin-page/admin-page.component';
import { AppChromeContentContainerComponent } from '@shell/app-chrome-content-container/app-chrome-content-container.component';
import { BuildDetailsComponent } from './build-details/build-details.component';
import { BuildsPageComponent } from './builds/builds-page/builds-page.component';
import { CRMPageComponent } from './CRM/crm-page/crm-page.component';
import { DefaultPasswordGuardService } from '@auth/services/default-password-guard.service';
import { HomeComponent } from './home/home.component';
import { NoteLibraryComponent } from './note-library/note-library.component';
import { PricingDetailsComponent } from './pricing-details/pricing-details.component';
import { PricingPageComponent } from './pricing/pricing-page/pricing-page.component';
import { ReportingPageComponent } from './reporting/reporting-page/reporting-page.component';
import { SchedulePageComponent } from './schedule/schedule-page/schedule-page.component';
import { StaffGuardService } from '@auth/services/staff-guard.service';

const staffRoutes: Routes = [
  { path: '', redirectTo: 'staff/home', pathMatch: 'full' },
  {
    path: '',
    component: AppChromeContentContainerComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, StaffGuardService],
      },
      {
        path: 'crm',
        component: CRMPageComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, StaffGuardService],
      },
      {
        path: 'builds',
        component: BuildsPageComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, StaffGuardService],
        data: { animation: 'page' },
      },
      {
        path: 'schedule',
        component: SchedulePageComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, StaffGuardService],
      },
      {
        path: 'pricing',
        component: PricingPageComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, StaffGuardService],
      },
      {
        path: 'reporting',
        component: ReportingPageComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, StaffGuardService],
      },
      {
        path: 'build/:specUid',
        component: BuildDetailsComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, StaffGuardService],
        data: { animation: 'build-details' },
      },
      {
        path: 'pricing/:specUid',
        component: PricingDetailsComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, StaffGuardService],
        data: { animation: 'pricing-details' },
      },
      {
        path: 'admin',
        component: AdminPageComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, StaffGuardService],
        data: { animation: 'admin' },
      },
      {
        path: 'note-library',
        component: NoteLibraryComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, StaffGuardService],
        data: { animation: 'admin' },
      },
    ],
  },
];

export const staffRouting = RouterModule.forChild(staffRoutes);
