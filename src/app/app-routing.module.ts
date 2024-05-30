import { RouterModule, Routes } from '@angular/router';

import { AppContainerComponent } from '@shell/app-container/app-container.component';
import { AuthActionComponent } from './login/components/auth-action/auth-action.component';
import { ChangePasswordComponent } from './login/components/change-password/change-password.component';
import { ForbiddenComponent } from './login/components/forbidden/forbidden.component';
import { ForgotPasswordComponent } from './login/components/forgot-password/forgot-password.component';
import { IconsPageComponent } from './icons.page.component';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './login/components/not-found/not-found.component';
import { SignInComponent } from './login/components/sign-in/sign-in.component';

const appRoutes: Routes = [
  {
    path: 'venture',
    component: AppContainerComponent, // todo to common?
    children: [
      {
        path: '',
        redirectTo: '/venture/login', // <-- Redirects to login route below
        pathMatch: 'full',
      },
      {
        path: 'login', // <-- This should equal /venture/login
        component: SignInComponent,
        //canActivate: [LoggedInGuardService],
        pathMatch: 'full',
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        pathMatch: 'full',
      },
      {
        path: 'forgot-password',
        pathMatch: 'full',
        component: ForgotPasswordComponent,
      },
      {
        path: 'auth',
        pathMatch: 'full',
        component: AuthActionComponent,
      },
      {
        path: 'icons',
        component: IconsPageComponent,
        pathMatch: 'full',
      },
      {
        path: '403',
        component: ForbiddenComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'clients',
    loadChildren: () => import('../-clients/clients.module').then((m) => m.ClientsModule),
  },
  {
    path: 'venture', // staff would be nicer but we have links in the wild with venture...
    loadChildren: () => import('../-venture/venture.module').then((m) => m.VentureModule),
  },
  {
    path: 'staff',
    loadChildren: () => import('../-staff/staff.module').then((m) => m.StaffModule),
  },
  {
    path: 'subbies',
    loadChildren: () => import('../-subbies/subbies.module').then((m) => m.SubbiesModule),
  },
  {
    path: 'public',
    loadChildren: () => import('../-print/print.module').then((m) => m.PrintModule),
  },
  { path: '', redirectTo: '/venture/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: false, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
