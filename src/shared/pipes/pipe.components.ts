import { CurrencyPipeComponent } from './currency-pipe.component';
import { CustomValueHintPipe } from './custom-value-hint.pipe';
import { CustomValuesExistPipe } from './custom-values-exist.pipe';
import { DatePipeComponent } from './date-pipe.component';
import { DefaultPipe } from './default.pipe';
import { IsHiddenPipe } from './is-hidden.pipe';
import { JsonPipeComponent } from './json-pipe.component';
import { TitleCasePipeComponent } from './titlecase-pipe.component';
import { YearPipeComponent } from './year-pipe.component';

export const pipeComponents = [
  YearPipeComponent,
  DatePipeComponent,
  TitleCasePipeComponent,
  CurrencyPipeComponent,
  JsonPipeComponent,
  CustomValueHintPipe,
  CustomValuesExistPipe,
  IsHiddenPipe,
  DefaultPipe,
];
