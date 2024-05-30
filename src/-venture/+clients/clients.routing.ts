import { RouterModule, Routes } from '@angular/router';

import { AppContainerComponent } from '@shell/app-container/app-container.component';
import { ClientsPageComponent } from './components/clients-page/clients-page.component';
import { StaffGuardService } from '@auth/services/staff-guard.service';

const clientsRoute: Routes = [
  {
    path: 'clients',
    component: AppContainerComponent,
    children: [
      {
        path: '',
        component: ClientsPageComponent,
        pathMatch: 'full',
        canActivate: [StaffGuardService],
      },
    ],
  },
];
export const ClientsRouting = RouterModule.forChild(clientsRoute);
