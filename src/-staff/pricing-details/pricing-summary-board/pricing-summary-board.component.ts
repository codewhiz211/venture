import { Component, Input, OnInit } from '@angular/core';
import { map, skipWhile } from 'rxjs/operators';

import { BaseComponent } from '@shared/components/base.component';
import { BehaviorSubject } from 'rxjs';
import { PricingService } from '@services/spec/pricing.service';

@Component({
  selector: 'app-pricing-summary-board',
  templateUrl: './pricing-summary-board.component.html',
  styleUrls: ['./pricing-summary-board.component.scss'],
})
export class PricingSummaryBoardComponent extends BaseComponent implements OnInit {
  @Input() data;

  public outStandingPricingItems$ = new BehaviorSubject(undefined);
  public completedPricingItems$ = new BehaviorSubject(undefined);

  constructor(private pricingService: PricingService) {
    super();
  }

  ngOnInit(): void {
    //pricing-details has already get the pricingItemUnderSpec$
    this.pricingService.pricingItemUnderSpec$
      .pipe(
        this.takeUntilDestroy(),
        skipWhile((v) => !v)
      )
      .subscribe((pricingItems) => {
        this.getPrcingItems(pricingItems);
      });
  }

  private getPrcingItems(pricingItems) {
    const outStandingPricingItems = [];
    const completedPricingItems = [];
    pricingItems.forEach((pricing, i) => {
      const isOutstanding = pricing.status != 'Submitted';
      if (isOutstanding) {
        outStandingPricingItems.push(this.getPricingItem(pricing, i));
      } else {
        completedPricingItems.push(this.getPricingItem(pricing, i));
      }
    });
    this.outStandingPricingItems$.next(outStandingPricingItems);
    this.completedPricingItems$.next(completedPricingItems);
  }

  private getPricingItem(pricing, i) {
    return { ...pricing, title: `Option ${i + 1}`, id: `option${i + 1}`, chips: this.addChips(pricing) };
  }

  private addChips(pricing) {
    const chips = [];
    if (pricing.attachment) {
      pricing.attachment.forEach((attachment) => {
        chips.push({ label: attachment.filename, icon: 'attach_file', link: attachment.url });
      });
    }
    chips.push({ label: pricing.userName || pricing.userEmail, icon: 'person' });
    chips.push({ label: this.formatAsCurrency(pricing.price) || 'TBC', icon: 'attach_money' });
    return chips;
  }

  formatAsCurrency(amount) {
    return Number(amount).toLocaleString();
  }

  onEdit(request) {
    this.data.handleTabChange(request.id);
  }

  onView(request) {
    this.data.handleTabChange(request.id);
  }
}
