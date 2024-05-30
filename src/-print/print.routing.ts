import { RouterModule, Routes } from '@angular/router';

import { PrintPageComponent } from './components/print-page/print-page.component';
import { PublicContainerComponent } from '@shell/public-container/public-container.component';

const printRoutes: Routes = [
  {
    path: '',
    component: PublicContainerComponent,
    children: [
      { path: 'share/:share/:uid/:sid/:optionid', component: PrintPageComponent, pathMatch: 'full' },
      { path: 'share/:share/:uid/:sid', component: PrintPageComponent, pathMatch: 'full' },
      { path: 'share/:share/:uid', component: PrintPageComponent, pathMatch: 'full' },
    ],
  },
];
export const PrintRouting = RouterModule.forChild(printRoutes);
