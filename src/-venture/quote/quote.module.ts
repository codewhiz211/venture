import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { QuoteHeaderComponent } from './components/quote-header/quote-header.component';
import { QuoteSummaryComponent } from './components/quote-summary/quote-summary.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [QuoteHeaderComponent, QuoteSummaryComponent],
  imports: [CommonModule, MatCardModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [QuoteHeaderComponent, QuoteSummaryComponent],
})
export class QuoteModule {}
