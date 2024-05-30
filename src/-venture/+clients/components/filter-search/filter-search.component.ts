import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { ClientService } from '../../services/client.service';
import { FilterService } from '../../services/filter.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ven-filter-search',
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.scss'],
})
export class FilterSearchComponent implements OnInit, OnDestroy {
  // these are possible items for the filters
  @Output() filterChanged = new EventEmitter();
  @Output() searchChanged = new EventEmitter();

  public keyUp = new Subject<string>();
  public showFilters = false;

  // these are the items selected on the filters
  public selectedOptions: any = {
    subdivisions: { any: true },
    consultants: { any: true },
    pms: { any: true },
    statuses: { any: true },
  };

  // these are possible items for the filters
  public filterOptions: any = {
    subdivisions: [],
    consultants: [],
    pms: [],
    statuses: [],
  };

  public filterDefinition: any = {};
  public searchTerm: string = '';

  private searchSubscription: Subscription;

  constructor(private clientService: ClientService, private filterService: FilterService) {}

  ngOnInit() {
    // debounce so don't search on every keystroke
    this.searchSubscription = this.keyUp.pipe(debounceTime(300)).subscribe((term) => this.onSearchChanged(term));

    // search terms were on the server, but keeping them up to date is actually
    // quite tricky. Easier to calculate when we fetch clients.
    this.clientService.clients$.subscribe((clients) => {
      if (clients) {
        const newOptions = this.filterService.getSearchTermsFromClients(clients);
        this.filterOptions = Object.assign(this.filterOptions, newOptions);
      }
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  onToggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onSearchChanged(searchValue) {
    this.searchTerm = searchValue;
    this.storeThenActiveFilter();
  }

  onRemoveSearch() {
    this.searchTerm = '';
    this.storeThenActiveFilter();
  }

  onSubdivisionChange(subdivisions) {
    this.selectedOptions.subdivisions = subdivisions;
    this.storeThenActiveFilter();
  }

  onRemoveSubdivision(subdivision) {
    this.selectedOptions.subdivisions[subdivision] = false;
    this.storeThenActiveFilter();
  }

  onConsultantChange(consultants) {
    this.selectedOptions.consultants = consultants;
    this.storeThenActiveFilter();
  }

  onRemoveConsultant(consultant) {
    this.selectedOptions.consultants[consultant] = false;
    this.storeThenActiveFilter();
  }

  onProjectManagerChange(pms) {
    this.selectedOptions.pms = pms;
    this.storeThenActiveFilter();
  }

  onRemovePm(pm) {
    this.selectedOptions.pms[pm] = false;
    this.storeThenActiveFilter();
  }

  onStatusChange(statuses) {
    this.selectedOptions.statuses = statuses;
    this.storeThenActiveFilter();
  }

  onRemoveStatus(status) {
    this.selectedOptions.statuses[status] = false;
    this.storeThenActiveFilter();
  }

  private storeThenActiveFilter() {
    const filterDefinition = this.getFilterDefinition();
    this.filterService.storeActiveFilter(filterDefinition);
    this.filterChanged.emit(filterDefinition);
  }

  private getFilterDefinition() {
    this.filterDefinition = {
      searchTerm: this.searchTerm,
      filterOptions: {
        subdivisions: this.filterService.filterOutUnSelected(this.selectedOptions.subdivisions),
        consultants: this.filterService.filterOutUnSelected(this.selectedOptions.consultants),
        pms: this.filterService.filterOutUnSelected(this.selectedOptions.pms),
        statuses: this.filterService.filterOutUnSelected(this.selectedOptions.statuses),
      },
    };
    return this.filterDefinition;
  }
}
