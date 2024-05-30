import { Component, OnChanges, SimpleChanges } from '@angular/core';

import { BaseSpecFieldComponent } from '../base-spec-field.component';
import { LoggerService } from '@services/logger.service';
import { LogicService } from '@services/spec/logic.service';
import { SpecService } from '@services/spec/spec.service';
import { TrackingService } from '@services/spec/tracking.service';

@Component({
  selector: 'ven-spec-number',
  templateUrl: './spec-number.component.html',
  styleUrls: ['./spec-number.component.scss'],
})
export class SpecNumberComponent extends BaseSpecFieldComponent implements OnChanges {
  constructor(loggerService: LoggerService, logicService: LogicService, specService: SpecService, trackingService: TrackingService) {
    super(loggerService, logicService, specService, trackingService);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
