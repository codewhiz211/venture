import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ClientsRouting } from './clients.routing';
import { CommonModule } from '@angular/common';
import { HomeLandingComponent } from './+home/components/home-landing.component';
import { ShellModule } from '@shell/shell.module';

@NgModule({
  declarations: [HomeLandingComponent],
  imports: [CommonModule, ShellModule, ClientsRouting],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  entryComponents: [],
})
export class ClientsModule {}
