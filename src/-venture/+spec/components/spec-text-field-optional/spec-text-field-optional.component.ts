import { Component, OnInit } from '@angular/core';

import { BaseAutocompleteComponent } from 'src/-venture/+spec/components/base-autocomplete.component';
import { LoggerService } from '@services/logger.service';
import { LogicService } from '@services/spec/logic.service';
import { SpecService } from '@services/spec/spec.service';
import { SuggestionService } from '@services/spec/suggestion.service';
import { TrackingService } from '@services/spec/tracking.service';

@Component({
  selector: 'ven-spec-text-field-optional',
  templateUrl: './spec-text-field-optional.component.html',
  styleUrls: ['./spec-text-field-optional.component.scss'],
})
export class SpecTextFieldOptionalComponent extends BaseAutocompleteComponent implements OnInit {
  public addText: string;
  public displayField: boolean;

  constructor(
    loggerService: LoggerService,
    logicService: LogicService,
    specService: SpecService,
    suggestionService: SuggestionService,
    trackingService: TrackingService
  ) {
    super(loggerService, logicService, specService, trackingService, suggestionService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.checkIfFieldAvailable();
  }

  addField() {
    const data = { [this.field.name]: '' };
    this.specService.updateSpec(this.spec.uid, this.section.name, this.field, data).subscribe(() => {
      this.displayField = true;
    });
  }

  removeField() {
    this.specService.deleteField(this.spec.uid, this.section.name, `${this.field.name}`).subscribe(() => {
      this.displayField = false;
    });
  }

  private checkIfFieldAvailable() {
    this.displayField = this.field.name in this.spec[this.section.name];
    this.addText = this.field.btnText || `Add ${this.field.display}`;
  }
}
