import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FilterDefinition } from '../../../filter-definition.interface';

@Component({
  selector: 'ven-selected-filters-list',
  templateUrl: './selected-filters-list.component.html',
  styleUrls: ['./selected-filters-list.component.scss']
})
export class SelectedFiltersLIstComponent implements OnChanges {
  @Input() definition: FilterDefinition = {
    searchTerm: '',
    filterOptions: {
      subdivisions: [],
      consultants: [],
      pms: [],
      statuses: []
    }
  };

  @Output() searchRemoved = new EventEmitter();
  @Output() subdivisionRemoved = new EventEmitter();
  @Output() consultantRemoved = new EventEmitter();
  @Output() pmRemoved = new EventEmitter();
  @Output() statusRemoved = new EventEmitter();

  public searchTerm: string;
  public subdivisions: string;
  public consultants: string;
  public pms: string;
  public statuses: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['definition']) {
      const definition = changes['definition'].currentValue;
      if (definition) {
        if (!definition.filterOptions) {
          definition.filterOptions = {};
        }
        this.searchTerm = definition.searchTerm;
        this.subdivisions = definition.filterOptions.subdivisions;
        this.consultants = definition.filterOptions.consultants;
        this.pms = definition.filterOptions.pms;
        this.statuses = definition.filterOptions.statuses;
      }
    }
  }

  public removeSearch() {
    this.searchRemoved.emit();
  }

  public removeSubdivision(subdivision: string) {
    this.subdivisionRemoved.emit(subdivision);
  }

  public removeConsultant(consultant: string) {
    this.consultantRemoved.emit(consultant);
  }

  public removePm(pm: string) {
    this.pmRemoved.emit(pm);
  }

  public removeStatus(status: string) {
    this.statusRemoved.emit(status);
  }
}
