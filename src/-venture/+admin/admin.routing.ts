import { RouterModule, Routes } from '@angular/router';

import { AdminGuardService } from '@auth/services/admin-guard.service';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { AppContainerComponent } from '@shell/app-container/app-container.component';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AppContainerComponent,
    children: [
      {
        path: '',
        component: AdminPageComponent,
        canActivate: [AdminGuardService],
        pathMatch: 'full',
      },
    ],
  },
];
export const AdminRouting = RouterModule.forChild(adminRoutes);
