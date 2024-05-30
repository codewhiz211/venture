import { Component, OnChanges, SimpleChanges } from '@angular/core';

import { BaseAutocompleteComponent } from '../base-autocomplete.component';
import { LoggerService } from '@services/logger.service';
import { LogicService } from '@services/spec/logic.service';
import { SpecService } from '@services/spec/spec.service';
import { SuggestionService } from '@services/spec/suggestion.service';
import { TrackingService } from '@services/spec/tracking.service';

@Component({
  selector: 'ven-spec-text-field-conditional',
  templateUrl: './spec-text-field-conditional.component.html',
  styleUrls: ['./spec-text-field-conditional.component.scss'],
  host: {
    '[class.hideField]': 'hideField',
  },
})
export class SpecTextFieldConditionalComponent extends BaseAutocompleteComponent implements OnChanges {
  constructor(
    loggerServie: LoggerService,
    logicService: LogicService,
    specService: SpecService,
    suggestionService: SuggestionService,
    trackingService: TrackingService
  ) {
    super(loggerServie, logicService, specService, trackingService, suggestionService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
