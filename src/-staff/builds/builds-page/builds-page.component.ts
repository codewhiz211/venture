import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';

import { AppBarMenuService } from '@shell/app-bar-menu.service';
import { BaseComponent } from '@shared/components/base.component';
import { ClientService } from '@clients/services/client.service';
import { Column } from '@shared/components/ven-table/columns.interface';
import { CreateClientComponent } from '@clients/components/create-client/create-client.component';
import { HeaderMenuService } from '@shell/header-menu.service';
import { PreferenceService } from '@services/preference.service';
import { Router } from '@angular/router';
import { SearchService } from '@services/search.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-builds-page',
  templateUrl: './builds-page.component.html',
  styleUrls: ['./builds-page.component.scss'],
})
export class BuildsPageComponent extends BaseComponent implements OnInit, OnDestroy {
  public clients$;
  public savedBuilds$;
  public columns: Column[];
  public initialSortedColumn;

  public passages = [
    'Save your current Builds here for quick and easy access.',
    'Simply tap the star on any build and a shortcut will be added here.',
  ];

  public filterValue$: BehaviorSubject<string> = new BehaviorSubject('');

  public searchActive$: Observable<boolean>;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private preference: PreferenceService,
    private dialogService: DialogService,
    private menuService: HeaderMenuService,
    private appBarService: AppBarMenuService,
    private searchService: SearchService
  ) {
    super();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.menuService.addMenuItem({
        icon: 'add',
        label: 'New Build',
        method: () => this.onAddNewClient(),
        order: 0,
      });
    }, 0);

    this.clients$ = this.clientService.clients$;

    this.searchService.searchValue$.subscribe((value) => this.updateFilter(value));

    this.searchActive$ = this.searchService.searchActive$.pipe(map((s) => s.open));

    this.searchActive$.subscribe((open) => {
      if (open) {
        this.appBarService.removeMenuItem('Search');
      } else {
        setTimeout(() => {
          this.appBarService.addMenuItem({
            icon: 'search',
            label: 'Search',
            method: () => this.searchService.openSearch('Search client or lot #'),
            order: 1,
          });
        });
      }
    });

    //Saved Builds
    this.savedBuilds$ = combineLatest([this.clientService.clients$, this.preference.savedSpecs$]).pipe(
      map(([clients, specs]) => {
        if (!clients || !specs) {
          return;
        }
        return clients.filter((client) => specs[client.uid]);
      }),
      this.takeUntilDestroy()
    );

    //All Builds Table
    this.clientService.getClients(true);
    this.columns = [
      { accessor: 'lot', label: 'Lot#', width: '25%', mobileWidth: '35%' },
      { accessor: 'client', label: 'Client', width: '30%', mobileWidth: '65%' },
      { accessor: 'lastModified', label: 'Last Modified', format: 'shortDate', width: '25%', mobileWidth: '0%' },
      { accessor: 'status', label: 'Status', conditionalWrap: { value: 'Completed', wrap: 'chip' }, width: '20%', mobileWidth: '0%' },
    ];
    this.initialSortedColumn = 'lastModified';
  }

  ngOnDestroy(): void {
    this.menuService.removeMenuItem('New Build');
    this.appBarService.removeMenuItem('Search');
  }

  updateFilter(filterValue) {
    this.filterValue$.next(filterValue);
  }

  viewSpecDetails(row) {
    this.router.navigate(['/staff/build/', row.uid]);
  }

  onAddNewClient() {
    this.dialogService
      .open(CreateClientComponent, { dialogTitle: 'Create new client', size: DialogSize.Large })
      .pipe(this.takeUntilDestroy())
      .subscribe((client) => {
        this.router.navigate(['staff', 'build', client.uid]);
      });
  }
}
