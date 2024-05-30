import { RouterModule, Routes } from '@angular/router';

// This is temporarily available until we have completed migration
// It loads the old Venture Application

const routes: Routes = [{ path: '', redirectTo: '/venture/clients', pathMatch: 'full' }];

export const VentureRoutingModule = RouterModule.forChild(routes);
