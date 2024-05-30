import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';

import { BaseComponent } from '@shared/components/base.component';
import { PricingNoteChoosingComponent } from './pricing-note-choosing/pricing-note-choosing.component';
import { PricingService } from '@services/spec/pricing.service';
import { PricingStatus } from '@interfaces/pricing-model.interface';
import { pricingSectionConfig } from './pricing-accordion.section';
import { skipWhile } from 'rxjs/operators';

@Component({
  selector: 'ven-pricing-accordion',
  templateUrl: './pricing-accordion.component.html',
  styleUrls: ['./pricing-accordion.component.scss'],
})
/**
 * The reason that we handle the p&g table states here is that we need to use the p&g table values in Credits & Extras
 * and also the submit button can get latest values when we submit the summary.
 */
export class PricingAccordionComponent extends BaseComponent implements OnChanges {
  @Input() pricing;
  @Input() client;
  @Input() optionId;
  @Input() specUid;
  public pricingSections = pricingSectionConfig;
  public adminMargin;
  public editable = true;

  constructor(private pricingService: PricingService, private dialogService: DialogService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pricing) {
      this.editable = this.pricing.status != PricingStatus.submitted;
    }
  }

  valueChanged(value, fieldName) {
    this.pricingService.updatePricing(this.pricing.uid, value, undefined, fieldName);
  }

  action(fieldName, targetField) {
    if (fieldName == 'note-library') {
      this.dialogService
        .open(PricingNoteChoosingComponent, { dialogTitle: 'Note Library', size: DialogSize.Large })
        .pipe(
          this.takeUntilDestroy(),
          skipWhile((v) => !v)
        )
        .subscribe((result) => {
          const newValue = this.pricing[targetField] ? `${this.pricing[targetField]}\n${result}` : result;
          this.pricingService.updatePricing(this.pricing.uid, newValue, undefined, targetField);
        });
    }
  }
}
