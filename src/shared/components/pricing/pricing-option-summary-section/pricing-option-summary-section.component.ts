import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '@shared/components/base.component';
import { PricingService } from '@services/spec/pricing.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ven-pricing-option-summary-section',
  templateUrl: './pricing-option-summary-section.component.html',
  styleUrls: ['./pricing-option-summary-section.component.scss'],
})
export class PricingOptionSummarySectionComponent extends BaseComponent implements OnInit {
  @Input() optionId;
  @Input() client;
  @Input() uid;
  @Input() specUid;

  public summaryHeader;
  public headerFields;
  public tableFields;

  public pricingTable;
  public notes;

  constructor(private pricingService: PricingService) {
    super();
  }

  ngOnInit(): void {
    this.initFieldsConfig();
    this.pricingService
      .getPricingOption(this.specUid, this.uid)
      .pipe(this.takeUntilDestroy())
      .subscribe((pricing) => {
        this.initSummaryHeaderAndNotes(pricing);
        this.pricingTable = this.pricingService.getSummary(pricing);
      });
  }

  private initFieldsConfig() {
    this.headerFields = [
      { name: 'option', display: 'Option #', type: 'text', class: 'half-width' },
      { name: 'date', display: 'Date', type: 'date', class: 'half-width' },
      { name: 'lot', display: 'Lot #', type: 'text', class: 'half-width' },
      { name: 'subdivision', display: 'Subdivision', type: 'text', class: 'half-width' },
      { name: 'client', display: 'Client Name', type: 'text', class: 'full-width' },
      { name: 'description', display: 'Option Description', type: 'text', class: 'full-width' },
    ];

    this.tableFields = [
      { section: 'png', display: ' P & G', children: [{ name: 'png', display: 'P & G' }] },
      {
        section: 'extras',
        display: 'Extras',
        children: [
          { name: 'labour', display: 'Labour' },
          { name: 'materials', display: 'Materials' },
          { name: 'quotes', display: 'Quotes' },
        ],
      },
      {
        section: 'credits',
        display: 'Credits',
        children: [
          { name: 'labour', display: 'Labour' },
          { name: 'materials', display: 'Materials' },
          { name: 'quotes', display: 'Quotes' },
        ],
      },
      { name: 'total', display: '', class: 'bold' },
      { name: 'admin', display: 'Admin', class: 'pull-right' },
      { name: 'subtotal', display: 'Subtotal', class: 'pull-right' },
      { name: 'gst', display: 'GST', class: 'pull-right' },
      { name: 'totalOptionPrice', display: 'Total Option Price', class: 'bold' },
    ];
  }

  private initSummaryHeaderAndNotes(pricing) {
    if (!pricing) {
      return;
    }
    this.summaryHeader = {
      option: this.optionId,
      date: Date.now(),
      lot: this.client.lot,
      subdivision: this.client.subdivision,
      client: this.client.client,
      description: pricing.description || 'TBC',
    };
    this.notes = pricing.notes?.split('\n');
  }
}
