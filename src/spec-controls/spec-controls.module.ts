import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { EditStatusComponent } from './components/spec-tab-content/edit-status/edit-status.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NonStandardOptionComponent } from './components/spec-tab-content/non-standard-option/non-standard-option.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { PrintModule } from '@print/print.module';
import { SharedModule } from '@shared/shared.module';
import { SpecAccordionReadonlyComponent } from './components/spec-accordion-readonly/spec-accordion-readonly.component';
import { SpecContentsReadOnlyComponent } from './components/spec-contents-readonly/spec-contents-readonly.component';
import { SpecModule } from '@spec/spec.module';
import { SpecTabContentComponent } from './components/spec-tab-content/spec-tab-content.component';

// This module exists because we cannot put these items in Shared Module because Shared Module depends on Print Module

const angularMaterialModules = [MatExpansionModule];

@NgModule({
  declarations: [
    SpecContentsReadOnlyComponent,
    SpecAccordionReadonlyComponent,
    SpecTabContentComponent,
    EditStatusComponent,
    NonStandardOptionComponent,
  ],
  imports: [
    CommonModule,
    ...angularMaterialModules,
    PrintModule,
    SharedModule,
    SpecModule, // for spec editor stuff. which perhaps should be moved into this module now
    PipesModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [SpecContentsReadOnlyComponent, SpecAccordionReadonlyComponent, SpecTabContentComponent],
  providers: [],
  entryComponents: [],
})
export class SpecControlsModule {}
