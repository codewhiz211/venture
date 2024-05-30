import { Component, OnChanges, SimpleChanges } from '@angular/core';

import { BaseSpecFieldComponent } from '../base-spec-field.component';
import { LoggerService } from '@services/logger.service';
import { LogicService } from '@services/spec/logic.service';
import { SpecService } from '@services/spec/spec.service';
import { TrackingService } from '@services/spec/tracking.service';

@Component({
  selector: 'ven-spec-text-area',
  templateUrl: './spec-text-area.component.html',
  styleUrls: ['./spec-text-area.component.scss'],
})
export class SpecTextAreaComponent extends BaseSpecFieldComponent implements OnChanges {
  public maxRows: number = 5;
  public minRows: number = 2;
  public display: boolean;
  public showHighlightField = false;
  public showHighlight: boolean;

  constructor(loggerService: LoggerService, logicService: LogicService, specService: SpecService, trackingService: TrackingService) {
    super(loggerService, logicService, specService, trackingService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    // unless otherwise specified limit row count to five.
    this.maxRows = this.field.maxRows || 5;
    this.minRows = this.field.minRows || 2;
    if (changes.spec && changes.spec.currentValue) {
      // for fields with lots of content (planning)
      // set to fit content, but still within max
      const text = super.getValue();
      if (text) {
        const textRows = text.split(/\r\n|\r|\n/).length + 2;
        if (textRows < this.maxRows) {
          this.maxRows = textRows;
        }
      }
      this.checkField();
    }
  }

  private checkField() {
    // This 'if'  display textarea which are not a 'PM Note' type
    if (this.spec && this.spec[this.section.name] && this.field.name.indexOf('PmNote') < 0) {
      this.display = true;
    } else {
      // This display textarea which are a 'PM Note' type and user added it
      this.showHighlightField = this.display =
        this.spec &&
        this.spec[this.section.name] &&
        this.field.name.indexOf('PmNote') >= 0 &&
        this.field.name in this.spec[this.section.name];

      this.showHighlight =
        this.spec['highlighted_notes'] &&
        this.spec['highlighted_notes'][this.section.name] &&
        this.spec['highlighted_notes'][this.section.name][this.field.name];
    }
  }
}
