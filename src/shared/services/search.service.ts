import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

// Allows the search input (title bar) to be disconnected from the component being searched E.g. Builds table on builds page

interface SearchOptions {
  open: boolean;
  placeholder: string;
}

const DEFAULT_PLACEHOLDER = 'Search...';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public _searchActive: BehaviorSubject<SearchOptions> = new BehaviorSubject({ open: false, placeholder: DEFAULT_PLACEHOLDER });
  public readonly searchActive$: Observable<SearchOptions> = this._searchActive.asObservable();

  public _searchValue: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly searchValue$: Observable<string> = this._searchValue.asObservable();

  constructor() {}

  public updateSearch(value: string) {
    this._searchValue.next(value);
  }

  public closeSearch() {
    this._searchActive.next({ open: false, placeholder: DEFAULT_PLACEHOLDER });
  }

  public openSearch(placeholder: string = DEFAULT_PLACEHOLDER) {
    this._searchActive.next({ open: true, placeholder });
  }
}
