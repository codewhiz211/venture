import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';

import { BaseComponent } from '@shared/components/base.component';
import { ClientService } from '@clients/services/client.service';
import { Column } from '@shared/components/ven-table/columns.interface';
import { HeaderMenuService } from '@shell/header-menu.service';
import { PreferenceService } from '@services/preference.service';
import { PricingService } from '@services/spec/pricing.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pricing-page',
  templateUrl: './pricing-page.component.html',
  styleUrls: ['./pricing-page.component.scss'],
})
export class PricingPageComponent extends BaseComponent implements OnInit, OnDestroy {
  public passages = [
    'Save any job to the homepage for quick and easy access.',
    'Simply tap the star on any job and it will be displayed here',
  ];

  public savedPricingClients$ = new Subject();

  public columns: Column[];

  public clients$;

  public initialSortedColumn;

  constructor(
    private clientService: ClientService,
    private preference: PreferenceService,
    private pricingService: PricingService,
    private router: Router,
    private menuService: HeaderMenuService
  ) {
    super();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.menuService.addMenuItem({
        icon: 'library_books',
        label: 'Note library',
        method: () => this.router.navigate(['staff', 'note-library']),
        order: 0,
      });
    }, 0);
    this.clients$ = combineLatest([this.clientService.clients$, this.pricingService.pricingItems$, this.preference.savedPricing$]).pipe(
      map(([clients, pricingItems, savedPricing]) => {
        if (!clients || !pricingItems || !savedPricing) {
          return;
        }
        const filteredClients = this.getClientsWithPricingItems(clients, pricingItems);
        const savedPricingClients = this.getSavedPricingClients(filteredClients, savedPricing);

        this.savedPricingClients$.next(savedPricingClients);
        return filteredClients;
      }),
      this.takeUntilDestroy()
    );
    this.clientService.getClients(true);
    this.pricingService.getAllPricingItem();
    this.columns = [
      { accessor: 'lot', label: 'DB Code', width: '30%', mobileWidth: '35%' },
      { accessor: 'client', label: 'Client Name', width: '30%', mobileWidth: '55%' },
      { accessor: 'lastModified', label: 'Last Modified', format: 'shortDate', width: '30%', mobileWidth: '0%' },
      { accessor: 'requestNumber', label: '', format: 'chip', icon: 'notifications', width: '10%', mobileWidth: '10%' }, //To do chips
    ];
    this.initialSortedColumn = 'lastModified';
  }

  ngOnDestroy(): void {
    this.menuService.removeMenuItem('Note library');
  }

  handleSaveToggled($event) {
    this.preference.handleSavedItemToggle('pricing', $event, false);
  }

  viewPricingDetails($event) {
    this.router.navigate(['staff/pricing', $event.uid]);
  }

  private getClientsWithPricingItems(clients, pricingItems) {
    const pricingSpecUids = Object.keys(pricingItems);
    return clients
      .filter((client) => pricingSpecUids.includes(client.uid))
      .map((client) => {
        return {
          ...client,
          requestNumber: Object.keys(pricingItems[client.uid]).length || 0,
        };
      });
  }

  private getSavedPricingClients(clients, savedPricing) {
    return clients
      .filter((client) => savedPricing[client.uid])
      .map((client) => {
        return {
          ...client,
          chips: [{ label: client.requestNumber, icon: 'notifications' }],
        };
      });
  }
}
