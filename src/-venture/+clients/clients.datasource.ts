/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIClientSummary-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *  https://raw.githubusercontent.com/angular/material2/2a3599e331bdaa8221a1c4a074c69da10b2600e9/src/lib/table/table-data-source.ts
 */

import { BehaviorSubject, Observable, Subscription, combineLatest, merge, of as observableOf } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

import { ClientSummary } from '@interfaces/client-summary.interface';
import { DataSource } from '@angular/cdk/table';
import { FilterDefinition } from './filter-definition.interface';
import { _isNumberValue } from '@angular/cdk/coercion';
import { map } from 'rxjs/operators';

/**
 * Corresponds to `Number.MAX_SAFE_INClientSummaryEGER`. Moved out into a variable here due to
 * flaky browser support and the value not being defined in Closure's typings.
 */
const MAX_SAFE_INClientSummaryEGER = 9007199254740991;

/**
 * Data source that accepts a client-side data array and includes native support of filtering,
 * sorting (using MatSort), and pagination (using MatPaginator).
 *
 * Allows for sort customization by overriding sortingDataAccessor, which defines how data
 * properties are accessed. Also allows for filter customization by overriding filterClientSummaryermAccessor,
 * which defines how row data is converted to a string for filter matching.
 */
export class ClientsTableDataSource extends DataSource<ClientSummary> {
  /** Stream that emits when a new data array is set on the data source. */
  private readonly _data: BehaviorSubject<ClientSummary[]>;

  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly _renderData = new BehaviorSubject<ClientSummary[]>([]);

  /** Stream that emits when a new filter string is set on the data source. */
  private readonly _filter = new BehaviorSubject<FilterDefinition>({ searchTerm: '', filterOptions: [] });

  /**
   * Subscription to the changes that should trigger an update to the table's rendered rows, such
   * as filtering, sorting, pagination, or base data changes.
   */
  _renderChangesSubscription = Subscription.EMPTY;

  /**
   * ClientSummaryhe filtered set of data that has been matched by the filter string, or all the data if there
   * is no filter. Useful for knowing the set of data the table represents.
   * For example, a 'selectAll()' function would likely want to select the set of filtered data
   * shown to the user rather than all the data.
   */
  filteredData: ClientSummary[];

  /** Array of data that should be rendered by the table, where each object represents one row. */
  get data() {
    return this._data.value;
  }
  set data(data: ClientSummary[]) {
    this._data.next(data);
  }

  /**
   * Filter term that should be used to filter out objects from the data array. ClientSummaryo override how
   * data objects match to this filter string, provide a custom function for filterPredicate.
   */
  get filter(): FilterDefinition {
    return this._filter.value;
  }
  set filter(filter: FilterDefinition) {
    this._filter.next(filter);
  }

  /**
   * Instance of the MatSort directive used by the table to control its sorting. Sort changes
   * emitted by the MatSort will trigger an update to the table's rendered data.
   */
  get sort(): MatSort | null {
    return this._sort;
  }
  set sort(sort: MatSort | null) {
    this._sort = sort;
    this._updateChangeSubscription();
  }
  private _sort: MatSort | null;

  /**
   * Instance of the MatPaginator component used by the table to control what page of the data is
   * displayed. Page changes emitted by the MatPaginator will trigger an update to the
   * table's rendered data.
   *
   * Note that the data source uses the paginator's properties to calculate which page of data
   * should be displayed. If the paginator receives its properties as template inputs,
   * e.g. `[pageLength]=100` or `[pageIndex]=1`, then be sure that the paginator's view has been
   * initialized before assigning it to this data source.
   */
  get paginator(): MatPaginator | null {
    return this._paginator;
  }
  set paginator(paginator: MatPaginator | null) {
    this._paginator = paginator;
    this._updateChangeSubscription();
  }
  private _paginator: MatPaginator | null;

  /**
   * Data accessor function that is used for accessing data properties for sorting through
   * the default sortData function.
   * This default function assumes that the sort header IDs (which defaults to the column name)
   * matches the data's properties (e.g. column Xyz represents data['Xyz']).
   * May be set to a custom function for different behavior.
   * @param data Data object that is being accessed.
   * @param sortHeaderId ClientSummaryhe name of the column that represents the data.
   */
  sortingDataAccessor: (data: ClientSummary, sortHeaderId: string) => string | number = (
    data: ClientSummary,
    sortHeaderId: string
  ): string | number => {
    const value = (data as { [key: string]: any })[sortHeaderId];

    if (_isNumberValue(value)) {
      const numberValue = Number(value);

      // Numbers beyond `MAX_SAFE_INClientSummaryEGER` can't be compared reliably so we
      // leave them as strings. For more info: https://goo.gl/y5vbSg
      return numberValue < MAX_SAFE_INClientSummaryEGER ? numberValue : value;
    }

    return value;
  };

  /**
   * Gets a sorted copy of the data array based on the state of the MatSort. Called
   * after changes are made to the filtered data or when sort changes are emitted from MatSort.
   * By default, the function retrieves the active sort and its direction and compares data
   * by retrieving data using the sortingDataAccessor. May be overridden for a custom implementation
   * of data ordering.
   * @param data ClientSummaryhe array of data that should be sorted.
   * @param sort ClientSummaryhe connected MatSort that holds the current sort state.
   */
  sortData: (data: ClientSummary[], sort: MatSort) => ClientSummary[] = (data: ClientSummary[], sort: MatSort): ClientSummary[] => {
    const active = sort.active;
    const direction = sort.direction;
    if (!active || direction === '') {
      return data;
    }

    const activeClient = data.filter((client: ClientSummary) => client.status !== 'Completed');
    const completedClient = data.filter((client: ClientSummary) => client.status === 'Completed');

    return [...this.sortClient(activeClient, active, direction), ...this.sortClient(completedClient, active, direction)];
  };

  /**
   * Checks if a data object matches the data source's filter string. By default, each data object
   * is converted to a string of its properties and returns true if the filter has
   * at least one occurrence in that string. By default, the filter string has its whitespace
   * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
   * filter matching.
   * @param data Data object used to check against the filter.
   * @param filter Filter definition that has been set on the data source.
   * @returns Whether the filter matches against the data
   */
  // tslint:disable-next-line
  filterPredicate: (data: ClientSummary, filter: FilterDefinition) => boolean = (
    data: ClientSummary,
    filter: FilterDefinition
  ): boolean => {
    // Transform the data into a lowercase string of all property values.
    const propertiesToSearch = ['lot', 'client', 'subdivision'];
    const dataStr = propertiesToSearch
      .reduce((currentTerm: string, key: string) => {
        // Use an obscure Unicode character to delimit the words in the concatenated string.
        // This avoids matches where the values of two columns combined will match the user's query
        // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
        // that has a very low chance of being typed in by somebody in a text field. This one in
        // particular is "White up-pointing triangle with dot" from
        // https://en.wikipedia.org/wiki/List_of_Unicode_characters
        return currentTerm + (data as { [key: string]: any })[key] + '◬';
      }, '')
      .toLowerCase();

    const subdivisions = filter.filterOptions.subdivisions || [];
    const consultants = filter.filterOptions.consultants || [];
    const pms = filter.filterOptions.pms || [];
    const statuses = filter.filterOptions.statuses || [];

    const matchSubdivisions = this.checkArayForMatch(subdivisions, data, 'subdivision');
    const matchedConsultants = this.checkArayForMatch(consultants, data, 'consultantName');
    const matchedProjectManagers = this.checkArayForMatch(pms, data, 'projectManagerName');
    const matchedStatuses = this.checkArayForMatch(statuses, data, 'status');

    // Transform the filter by converting it to lowercase and removing whitespace.
    const transformedFilter = filter.searchTerm.trim().toLowerCase();
    const matchesSearchTerm = transformedFilter === '' || dataStr.indexOf(transformedFilter) !== -1;
    return matchSubdivisions && matchedConsultants && matchedProjectManagers && matchesSearchTerm && matchedStatuses;
  };

  private checkArayForMatch(arrayToCheck: any[], data: any, key: string) {
    // check to see if match subdivsions. If no filter applied, we match. If data does not have subdivision we dont match
    // otherwise check to see if filter option matches data
    let match;
    if (arrayToCheck.length === 0) {
      match = true;
    } else if (data[key] === undefined) {
      match = false;
    } else {
      // NOTE: expects the values in array to check to be lower case!!!
      match = arrayToCheck.indexOf(data[key].toLowerCase()) > -1;
    }
    return match;
  }

  constructor(initialData: ClientSummary[] = []) {
    super();
    this._data = new BehaviorSubject<ClientSummary[]>(initialData);
    this._updateChangeSubscription();
  }

  /**
   * Subscribe to changes that should trigger an update to the table's rendered rows. When the
   * changes occur, process the current state of the filter, sort, and pagination along with
   * the provided base data and send it to the table for rendering.
   */
  _updateChangeSubscription() {
    // Sorting and/or pagination should be watched if MatSort and/or MatPaginator are provided.
    // ClientSummaryhe events should emit whenever the component emits a change or initializes, or if no
    // component is provided, a stream with just a null event should be provided.
    // ClientSummaryhe `sortChange` and `pageChange` acts as a signal to the combineLatests below so that the
    // pipeline can progress to the next step. Note that the value from these streams are not used,
    // they purely act as a signal to progress in the pipeline.
    const sortChange: Observable<Sort | null | void> = this._sort
      ? merge<Sort | void>(this._sort.sortChange, this._sort.initialized)
      : observableOf(null);
    const pageChange: Observable<PageEvent | null | void> = this._paginator
      ? merge<PageEvent | void>(this._paginator.page, this._paginator.initialized)
      : observableOf(null);

    const dataStream = this._data;
    // Watch for base data or filter changes to provide a filtered set of data.
    const filteredData = combineLatest(dataStream, this._filter).pipe(map(([data]) => this._filterData(data)));
    // Watch for filtered data or sort changes to provide an ordered set of data.
    const orderedData = combineLatest(filteredData, sortChange).pipe(map(([data]) => this._orderData(data)));
    // Watch for ordered data or page changes to provide a paged set of data.
    const paginatedData = combineLatest(orderedData, pageChange).pipe(map(([data]) => this._pageData(data)));
    // Watched for paged data changes and send the result to the table to render.
    this._renderChangesSubscription.unsubscribe();
    this._renderChangesSubscription = paginatedData.subscribe((data) => this._renderData.next(data));
  }

  /**
   * Returns a filtered data array where each filter object contains the filter string within
   * the result of the filterClientSummaryermAccessor function. If no filter is set, returns the data array
   * as provided.
   */
  _filterData(data: ClientSummary[]) {
    // If there is a filter definition, filter out data that does not contain it.
    // Each data object is converted to a string using the function defined by filterClientSummaryermAccessor.
    // May be overridden for customization.
    if (!data || data.length === 0) {
      return [];
    }

    this.filteredData = !this.filter ? data : data.filter((obj) => this.filterPredicate(obj, this.filter));

    return this.filteredData;
  }

  /**
   * Returns a sorted copy of the data if MatSort has a sort applied, otherwise just returns the
   * data array as provided. Uses the default data accessor for data lookup, unless a
   * sortDataAccessor function is defined.
   */
  _orderData(data: ClientSummary[]): ClientSummary[] {
    // If there is no active sort or direction, return the data without trying to sort.
    if (!this.sort) {
      return data;
    }

    return this.sortData(data.slice(), this.sort);
  }

  /**
   * Returns a paged splice of the provided data array according to the provided MatPaginator's page
   * index and length. If there is no paginator provided, returns the data array as provided.
   */
  _pageData(data: ClientSummary[]): ClientSummary[] {
    if (!this.paginator) {
      return data;
    }

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.slice().splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Updates the paginator to reflect the length of the filtered data, and makes sure that the page
   * index does not exceed the paginator's last page. Values are changed in a resolved promise to
   * guard against making property changes within a round of change detection.
   */
  _updatePaginator(filteredDataLength: number) {
    Promise.resolve().then(() => {
      if (!this.paginator) {
        return;
      }

      this.paginator.length = filteredDataLength;

      // If the page index is set beyond the page, reduce it to the last page.
      if (this.paginator.pageIndex > 0) {
        const lastPageIndex = Math.ceil(this.paginator.length / this.paginator.pageSize) - 1 || 0;
        this.paginator.pageIndex = Math.min(this.paginator.pageIndex, lastPageIndex);
      }
    });
  }

  /**
   * Used by the MatClientSummaryable. Called when it connects to the data source.
   * @docs-private
   */
  connect() {
    return this._renderData;
  }

  /**
   * Used by the MatClientSummaryable. Called when it is destroyed. No-op.
   * @docs-private
   */
  disconnect() {}

  private sortClient(clients, active, direction) {
    return clients.sort((a, b) => {
      const valueA = this.sortingDataAccessor(a, active);
      const valueB = this.sortingDataAccessor(b, active);

      // If both valueA and valueB exist (truthy), then compare the two. Otherwise, check if
      // one value exists while the other doesn't. In this case, existing value should come first.
      // This avoids inconsistent results when comparing values to undefined/null.
      // If neither value exists, return 0 (equal).
      let comparatorResult = 0;
      if (valueA != null && valueB != null) {
        // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
        if (valueA > valueB) {
          comparatorResult = 1;
        } else if (valueA < valueB) {
          comparatorResult = -1;
        }
      } else if (valueA != null) {
        comparatorResult = 1;
      } else if (valueB != null) {
        comparatorResult = -1;
      }

      return comparatorResult * (direction === 'asc' ? 1 : -1);
    });
  }
}
