import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

import { SearchService } from '@services/search.service';

@Component({
  selector: 'ven-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() searchChanged = new EventEmitter();
  @ViewChild('filterInput', { static: true }) input: ElementRef;

  keyUp = new Subject<string>();

  private destroy$ = new Subject();

  public placeholder$: Observable<string>;

  constructor(private router: Router, private searchService: SearchService) {}

  ngOnInit(): void {
    this.keyUp.pipe(debounceTime(300)).subscribe((term) => this.onSearchChanged(term));
    this.placeholder$ = this.searchService.searchActive$.pipe(map((s) => s.placeholder));

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.searchService.closeSearch();
    });
  }

  ngAfterViewInit() {
    this.input.nativeElement.focus();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClose() {
    this.searchService.closeSearch();
    this.searchService.updateSearch('');
  }

  onSearchChanged(searchTerm) {
    this.searchService.updateSearch(searchTerm);
  }
}
