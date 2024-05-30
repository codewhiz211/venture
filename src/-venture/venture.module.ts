import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminModule } from './+admin/admin.module';
import { ClientsModule } from 'src/-venture/+clients/clients.module';
import { CommonModule } from '@angular/common';
import { ExtrasModule } from 'src/-venture/extras/extras.module';
import { JobsCommonModule } from '@jobs/jobs-common.module';
import { QuoteModule } from 'src/-venture/quote/quote.module';
import { SharedModule } from '@shared/shared.module';
import { ShellModule } from '@shell/shell.module';
import { SpecModule } from 'src/-venture/+spec/spec.module';
import { VentureRoutingModule } from './venture.routing';
import { angularMaterialModules } from '../app/app.module.imports';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    [...angularMaterialModules],
    AdminModule,
    ClientsModule,
    ExtrasModule,
    QuoteModule,
    SpecModule,
    JobsCommonModule,
    ShellModule,
    SharedModule,
    VentureRoutingModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  entryComponents: [],
})
export class VentureModule {}
