import { RouterModule, Routes } from '@angular/router';

import { AppContainerComponent } from '@shell/app-container/app-container.component';
import { CanDeactivateGuard } from '@auth/services/can-deactivate.service';
import { SpecPageComponent } from './components/spec-page/spec-page.component';
import { StaffGuardService } from '@auth/services/staff-guard.service';

const specRoutes: Routes = [
  {
    path: 'spec',
    component: AppContainerComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: SpecPageComponent,
        canActivate: [StaffGuardService],
      },
      {
        path: ':uid',
        pathMatch: 'full',
        component: SpecPageComponent,
        canActivate: [StaffGuardService],
        canDeactivate: [CanDeactivateGuard],
      },
    ],
  },
];
export const SpecRouting = RouterModule.forChild(specRoutes);
