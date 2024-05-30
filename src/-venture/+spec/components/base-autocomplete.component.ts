import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';

import { BaseSpecFieldComponent } from 'src/-venture/+spec/components';
import { LoggerService } from '@services/logger.service';
import { LogicService } from '@services/spec/logic.service';
import { SpecService } from '@services/spec/spec.service';
import { Subject } from 'rxjs';
import { SuggestionService } from '@services/spec/suggestion.service';
import { TrackingService } from '@services/spec/tracking.service';

/**
 * This base class provides the ability for it's descendents to retrieve a list of suggested values from the server.
 * Each time the user adds a new entry, it is saved to the database.
 * Each entry is tied to the control on which it was added. This way, we don't end up with one huge list of suggestions for each control.
 *
 * This control extends BaseSpecFieldComponent in order to have access to common styling and auto save etc.
 */
@Component({
  selector: 'ven-base-autocomplete',
  template: '',
})
export class BaseAutocompleteComponent extends BaseSpecFieldComponent implements OnInit, OnDestroy {
  public suggestedList: string[] = []; // list of suggestions for this field (from DB)
  public autocompleteList: string[] = []; // list of filter suggestions based on current value

  constructor(
    protected logger: LoggerService,
    logicService: LogicService,
    specService: SpecService,
    trackingService: TrackingService,
    protected suggestionService: SuggestionService
  ) {
    super(logger, logicService, specService, trackingService);
  }

  private _destroy$ = new Subject<any>();

  ngOnInit(): void {
    this.initSuggestedList();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  initSuggestedList() {
    const sectionName = this.section.name.split('^')[0];
    this.suggestedList = this.getSuggestionsForField(sectionName, this.field.name);
    this.logger.debug(`${this.section.name} = ${this.field.name} => ${JSON.stringify(this.suggestedList)}`);
  }

  setAutoComplete(value) {
    if (value && value.trim() !== '') {
      this.autocompleteList = this.suggestedList.filter((item) => {
        if (item) {
          return item && item.toLowerCase().indexOf(value.toLowerCase()) >= 0;
        }
      });
    } else {
      this.autocompleteList = this.suggestedList.slice(0);
    }
  }

  // update suggested list for current field
  updateSuggestionList(value: string) {
    if (!value) {
      return;
    }
    let allowUpdate = true;
    if (this.suggestedList.length) {
      for (const item of this.suggestedList) {
        if (item.toLowerCase().indexOf(value.toLowerCase()) === 0) {
          allowUpdate = false;
          return;
        }
      }
    }
    if (value.trim() && allowUpdate) {
      const list = [...this.suggestedList, value];
      this.suggestionService
        .updateSuggestedList(list, this.section.name.split('^')[0], this.field.name)
        .pipe(
          tap(() => this.updateLocalList(value)),
          takeUntil(this._destroy$)
        )
        .subscribe();
    }
    this.autocompleteList = [];
  }

  updateField() {
    this.updateSuggestionList(this.fieldControl.value);
    // fixed strange autocomplete behavior, because 'blur' works faster than we chose item from autocomplete
    setTimeout(() => {
      this.saveField();
    }, 300);
  }

  private updateLocalList(value) {
    this.suggestedList.push(value);
  }

  private getSuggestionsForField(sectionName: string, fieldName: string) {
    const suggestions = this.spec.suggestions;
    if (suggestions && suggestions[sectionName] && suggestions[sectionName][fieldName]) {
      return suggestions[sectionName][fieldName];
    }
    return [];
  }
}
