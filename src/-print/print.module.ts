// Modules 3rd party
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from '@shared/pipes/pipes.module';
import { PrintChecklistsSectionComponent } from './components/print-checklists-section/print-checklists-section.component';
import { PrintChromeDialogComponent } from './components/print-chrome-dialog/print-chrome-dialog.component';
import { PrintColourComponent } from './components/print-colour/print-colour.component';
import { PrintCoverPageComponent } from './components/print-cover-page/print-cover-page.component';
import { PrintCustomFieldComponent } from './components/print-custom-field/print-custom-field.component';
import { PrintElectricalSectionComponent } from './components/print-electrical-section/print-electrical-section.component';
import { PrintExtrasComponent } from './components/print-extras/print-extras.component';
import { PrintExtrasSectionComponent } from './components/print-extras-section/print-extras-section.component';
import { PrintExtrasTotalComponent } from './components/print-extras-total/print-extras-total.component';
import { PrintGroupedSectionComponent } from './components/print-grouped-section/print-grouped-section.component';
import { PrintImageComponent } from './components/print-image/print-image.component';
import { PrintItemComponent } from './components/print-item/print-item.component';
import { PrintItemFullWidthComponent } from './components/print-item-full-width/print-full-width.component';
import { PrintPageComponent } from './components/print-page/print-page.component';
import { PrintPlanningSectionComponent } from './components/print-planning-section/print-planning-section.component';
import { PrintQuoteSectionComponent } from './components/print-quote-section/print-quote-section.component';
import { PrintRouting } from './print.routing';
import { PrintSectionSignatureComponent } from './components/print-section-signature/print-section-signature.component';
import { PrintService } from './services/print.service';
import { PrintSignatureSectionComponent } from './components/print-signature-section/print-signature-section.component';
import { PrintSpecComponent } from './components/print-spec/print-spec.component';
import { PrintStandardSectionComponent } from './components/print-standard-section/print-standard-section.component';
import { PrintTextAreaComponent } from './components/print-text-area/print-text-area.component';
import { PrintTextFieldComponent } from './components/print-text-field/print-text-field.component';
import { QuoteModule } from 'src/-venture/quote/quote.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { ShellModule } from '@shell/shell.module';
import { SpecModule } from 'src/-venture/+spec/spec.module';
import { PrintButtonComponent } from './components/print-button/print-button.component';

@NgModule({
  declarations: [
    PrintPageComponent,
    PrintChecklistsSectionComponent,
    PrintCoverPageComponent,
    PrintPlanningSectionComponent,
    PrintStandardSectionComponent,
    PrintElectricalSectionComponent,
    PrintGroupedSectionComponent,
    PrintExtrasSectionComponent,
    PrintExtrasTotalComponent,
    PrintExtrasComponent,
    PrintSignatureSectionComponent,
    PrintQuoteSectionComponent,
    PrintChromeDialogComponent,
    PrintCustomFieldComponent,
    PrintSectionSignatureComponent,
    PrintItemComponent,
    PrintItemFullWidthComponent,
    PrintImageComponent,
    PrintColourComponent,
    PrintTextAreaComponent,
    PrintTextFieldComponent,
    PrintSpecComponent,
    PrintButtonComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    SpecModule,
    QuoteModule,
    SharedModule,
    ShellModule,
    PrintRouting,
    PipesModule,
  ],
  providers: [PrintService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    PrintSpecComponent,
    PrintChecklistsSectionComponent,
    PrintCoverPageComponent,
    PrintPlanningSectionComponent,
    PrintStandardSectionComponent,
    PrintElectricalSectionComponent,
    PrintGroupedSectionComponent,
    PrintExtrasSectionComponent,
    PrintExtrasTotalComponent,
    PrintExtrasComponent,
    PrintSignatureSectionComponent,
    PrintQuoteSectionComponent,
    PrintChromeDialogComponent,
    PrintCustomFieldComponent,
    PrintSectionSignatureComponent,
    PrintItemComponent,
    PrintItemFullWidthComponent,
    PrintImageComponent,
    PrintColourComponent,
    PrintTextAreaComponent,
    PrintTextFieldComponent,
  ],
  entryComponents: [PrintChromeDialogComponent],
})
export class PrintModule {}
