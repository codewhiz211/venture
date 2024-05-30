import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ven-table-search-bar',
  templateUrl: './table-search-bar.component.html',
  styleUrls: ['./table-search-bar.component.scss'],
})
export class TableSearchBarComponent implements OnInit, OnDestroy {
  @Input() placeholder: String;
  @Output() searchChanged = new EventEmitter();

  keyUp = new Subject<string>();

  private destroy$ = new Subject();

  constructor() {}

  ngOnInit(): void {
    this.keyUp.pipe(debounceTime(300)).subscribe((term) => this.onSearchChanged(term));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChanged(searchTerm) {
    this.searchChanged.emit(searchTerm);
  }
}
