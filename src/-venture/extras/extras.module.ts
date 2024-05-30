// Modules 3rd party
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ExtrasHeaderComponent } from './components/extras-header/extras-header.component';
import { ExtrasPreContractMessageComponent } from './components/extras-pre-contract-message/extras-pre-contract-message.component';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [ExtrasHeaderComponent, ExtrasPreContractMessageComponent],
  imports: [CommonModule, MatCardModule, SharedModule],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ExtrasHeaderComponent, ExtrasPreContractMessageComponent],
})
export class ExtrasModule {}
