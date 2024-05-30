import { RouterModule, Routes } from '@angular/router';

import { AppContainerComponent } from '@shell/app-container/app-container.component';
import { ClientGuardService } from '@auth/services/client-guard.service';
import { DefaultPasswordGuardService } from '@auth/services/default-password-guard.service';
import { HomeLandingComponent } from './+home/components/home-landing.component';

const routes: Routes = [
  { path: '', redirectTo: 'clients/home', pathMatch: 'full' },
  {
    path: 'home',
    component: AppContainerComponent,
    children: [
      {
        path: '',
        component: HomeLandingComponent,
        pathMatch: 'full',
        canActivate: [DefaultPasswordGuardService, ClientGuardService],
      },
    ],
  },
];
export const ClientsRouting = RouterModule.forChild(routes);
