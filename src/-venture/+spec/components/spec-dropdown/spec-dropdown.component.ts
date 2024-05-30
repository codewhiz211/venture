import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { BehaviorSubject, Observable, concat } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { BaseSpecFieldComponent } from '../base-spec-field.component';
import { DropdownItem } from '../field-config.interface';
import { LoggerService } from '@services/logger.service';
import { LogicService } from '@services/spec/logic.service';
import { SpecService } from '@services/spec/spec.service';
import { TrackingService } from '@services/spec/tracking.service';

/**
 * NOTE: No longer used. spec-drop is used instead as it.
 * If this control is needed again it will need to be updated to support custom values
 * see: ISupportCustomValues
 */

/**
 * This control allows a user to choose from a list of options.
 * If they choose the 'Other - please specify' option, they can enter free text.
 *
 */
@Component({
  selector: 'ven-spec-dropdown',
  templateUrl: './spec-dropdown.component.html',
  styleUrls: ['./spec-dropdown.component.scss'],
  host: {
    '[class.fullWidth]': 'isFullWidth',
    '[class.hideField]': 'hideField',
  },
})
export class SpecDropdownComponent extends BaseSpecFieldComponent implements OnInit, OnChanges {
  @ViewChild('auto', { static: true }) autoComplete: ElementRef;
  @ViewChild(MatAutocompleteTrigger, { static: true }) autocomplete: MatAutocompleteTrigger;
  public filteredItems: Observable<DropdownItem[]>; // items displayed in dropdown to user
  private selectedOption = new BehaviorSubject<any>(undefined);
  private fieldIsDirty = false; // use a dirty flag to prevent multiple updates caused bur onBlur after OnSelectionChange
  private items: DropdownItem[] = [];
  public isOtherMode = false;
  public inputElement;
  constructor(
    loggerService: LoggerService,
    logicService: LogicService,
    specService: SpecService,
    trackingService: TrackingService,
    @Inject(DOCUMENT) document
  ) {
    super(loggerService, logicService, specService, trackingService);
  }

  ngOnInit() {
    this.inputElement = document.getElementById(`input-${this.field.name}`);
    this.items = this.field.items.map((item) => {
      const selectItem = {
        display: item,
        value: item,
      };
      return selectItem;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    // isOther mode used to control the entry of free text in control
    this.isOtherMode = this._isOther(this.fieldControl.value);
    this.fieldIsDirty = false;

    // each time the use types, narrow the list of potential options.
    // if the user types something not in the list, there will be no options.
    // this is require to allow an option not in the list to be saved
    // (else it would simply save an option from the list and not the text entered)
    const filteredChanges = this.fieldControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    // each time the user selects and option, reset the filtered items to include all options
    const selectedOptionChanges = this.selectedOption.pipe(map(() => this._filter('')));
    // update filtered options whenever, user types, or selects an option
    this.filteredItems = concat(filteredChanges, selectedOptionChanges);
    this.fieldControl.valueChanges.subscribe(() => (this.fieldIsDirty = true));
  }

  onBlur() {
    if (this.fieldIsDirty) {
      super.saveField();
    }
  }

  onKeydown(event) {
    if (!this.isOtherMode) {
      // only allow the user to enter text if in 'Other' mode
      event.preventDefault();
      return;
    } // when value is typed, we can simply call base method
    if (event.key === 'Enter' && this.fieldIsDirty) {
      super.saveField();
      this.fieldIsDirty = !this.updatedSucceeded; // default behaviour for Enter key is to keep the options panel open. Stop that.
      this.autocomplete.closePanel();
    }
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    // when an option is selected, we need to provide the change
    if (event) {
      super.saveField({
        [this.field.name]: event.option.value,
      });
      this.fieldIsDirty = !this.updatedSucceeded;
      this.selectedOption.next('');
    }
  }

  public toggleDropdown(event) {
    if (!this.saveInProgress) {
      if (this.autocomplete.panelOpen) {
        this.autocomplete.closePanel();
        event.stopPropagation();
        event.preventDefault();
      } else {
        this.autocomplete.openPanel();
      }
    }
  }

  private _isOther(value: string): boolean {
    const selectedItemNotInList = this.items && this.items.length > 0 && this._filter(value).length === 0;
    const isOther = value === 'Other - Please Specify' || selectedItemNotInList;
    return isOther;
  }

  private _filter(value: string): DropdownItem[] {
    if (!value) {
      return this.items;
    }
    if (value === this.fieldControl.value) {
      // if user has selected the same option, reset filter.
      return this.items;
    }
    const filterValue = value.toLowerCase();
    return this.items.filter((item) => item.display.toLowerCase().indexOf(filterValue) === 0);
  }
}
