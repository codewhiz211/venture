import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { BaseSpecFieldComponent } from '../base-spec-field.component';
import { LoggerService } from '@services/logger.service';
import { LogicService } from '@services/spec/logic.service';
import { SpecService } from '@services/spec/spec.service';
import { TrackingService } from '@services/spec/tracking.service';

@Component({
  selector: 'ven-spec-subtitle-conditional',
  templateUrl: './spec-subtitle-conditional.component.html',
  styleUrls: ['./spec-subtitle-conditional.component.scss'],
  host: {
    '[class.hideField]': 'hideField',
  },
})
export class SpecSubtitleConditionalComponent extends BaseSpecFieldComponent implements OnInit, OnChanges {
  public subTitle;

  constructor(loggerService: LoggerService, logicService: LogicService, specService: SpecService, trackingService: TrackingService) {
    super(loggerService, logicService, specService, trackingService);
  }
  ngOnInit() {
    this.getSubtitle(this.spec);
  }

  getSubtitle(spec) {
    // if the user has edited the field title (subtitle) we use that
    // else we default (in the template) to the configured field title
    const custom_fields = spec['custom_fields'];
    if (custom_fields && custom_fields[this.section.name]) {
      this.subTitle = custom_fields[this.section.name][this.field.name];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['spec']) {
      this.getSubtitle(changes['spec'].currentValue);
    }
    super.ngOnChanges(changes);
  }
}
