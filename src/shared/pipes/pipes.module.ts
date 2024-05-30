import { CommonModule } from '@angular/common';
import { CurrencyPipeComponent } from './currency-pipe.component';
import { CustomValueHintPipe } from './custom-value-hint.pipe';
import { CustomValuesExistPipe } from './custom-values-exist.pipe';
import { DatePipeComponent } from './date-pipe.component';
import { DefaultPipe } from './default.pipe';
import { IsHiddenPipe } from './is-hidden.pipe';
import { JsonPipeComponent } from './json-pipe.component';
// Modules 3rd party
import { NgModule } from '@angular/core';
import { TitleCasePipeComponent } from './titlecase-pipe.component';
// Pipes
import { YearPipeComponent } from './year-pipe.component';

@NgModule({
  declarations: [
    YearPipeComponent,
    DatePipeComponent,
    TitleCasePipeComponent,
    CurrencyPipeComponent,
    JsonPipeComponent,
    CustomValueHintPipe,
    CustomValuesExistPipe,
    IsHiddenPipe,
    DefaultPipe,
  ],
  imports: [CommonModule],
  exports: [
    YearPipeComponent,
    DatePipeComponent,
    TitleCasePipeComponent,
    CurrencyPipeComponent,
    JsonPipeComponent,
    CustomValueHintPipe,
    CustomValuesExistPipe,
    IsHiddenPipe,
    DefaultPipe,
  ],
})
export class PipesModule {}
