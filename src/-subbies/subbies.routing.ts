import { RouterModule, Routes } from '@angular/router';

import { AppChromeContentContainerComponent } from '../shell/app-chrome-content-container/app-chrome-content-container.component';
import { DefaultPasswordGuardService } from '@auth/services/default-password-guard.service';
import { HomePageComponent } from './home/components/home-page/home-page.component';
import { JobDetailsPageComponent } from './jobs/components/job-details/job-details.component';
import { JobsPageComponent } from './jobs/components/jobs-page/jobs-page.component';
import { SchedulePageComponent } from './schedule/components/schedule-page/schedule-page.component';
import { SubbieGuardService } from '@auth/services/subbie-guard.service';

const adminRoutes: Routes = [
  { path: '', redirectTo: 'subbies/home', pathMatch: 'full' },
  {
    path: '',
    component: AppChromeContentContainerComponent,
    children: [
      {
        path: 'home',
        component: HomePageComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, SubbieGuardService],
        data: { animation: 'page' },
      },
      {
        path: 'jobs',
        component: JobsPageComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, SubbieGuardService],
        data: { animation: 'page' },
      },
      {
        path: 'schedule',
        component: SchedulePageComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, SubbieGuardService],
        data: { animation: 'page' },
      },
      {
        path: 'jobs/:specUid/:subbieUid/:jobUid',
        component: JobDetailsPageComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, SubbieGuardService],
        data: { animation: 'job-details' },
      },
    ],
  },
];
export const SubbiesRouting = RouterModule.forChild(adminRoutes);
