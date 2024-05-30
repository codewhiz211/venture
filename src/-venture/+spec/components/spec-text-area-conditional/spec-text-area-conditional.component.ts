import { Component, OnChanges, SimpleChanges } from '@angular/core';

import { BaseSpecFieldComponent } from '..';
import { LoggerService } from '@services/logger.service';
import { LogicService } from '@services/spec/logic.service';
import { SpecService } from '@services/spec/spec.service';
import { TrackingService } from '@services/spec/tracking.service';

@Component({
  selector: 'ven-spec-text-area-conditional',
  templateUrl: './spec-text-area-conditional.component.html',
  styleUrls: ['./spec-text-area-conditional.component.scss'],
  host: {
    '[class.hideField]': 'hideField',
  },
})
export class SpecTextAreaConditionalComponent extends BaseSpecFieldComponent implements OnChanges {
  constructor(loggerService: LoggerService, logicService: LogicService, specService: SpecService, trackingService: TrackingService) {
    super(loggerService, logicService, specService, trackingService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
