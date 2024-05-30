import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '@shared/components/base.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PricingService } from '@services/spec/pricing.service';

@Component({
  selector: 'ven-submit-pricing',
  templateUrl: './submit-pricing.component.html',
  styleUrls: ['./submit-pricing.component.scss'],
})
export class SubmitPricingComponent extends BaseComponent implements OnInit {
  @Input() data;
  private specUid;
  private uid;
  private optionId;
  public pricingToSubmit;
  public fields;

  public submitAction = {
    label: 'SUBMIT',
    handler: () => this.onSubmit(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onNoClick(),
  };
  constructor(private dialogService: DialogService, private pricingService: PricingService, private snackBar: MatSnackBar) {
    super();
  }

  ngOnInit(): void {
    this.uid = this.data.pricingUid;
    this.specUid = this.data.specUid;
    this.optionId = this.data.optionId;
    this.initFields();
    this.pricingService
      .getPricingOption(this.specUid, this.uid)
      .pipe(this.takeUntilDestroy())
      .subscribe((pricing) => {
        this.initPricing(pricing);
      });
  }
  private initPricing(pricing) {
    const pricingTotal = this.pricingService.getSummary(pricing);
    this.pricingToSubmit = {
      option: this.optionId,
      description: pricing.description,
      price: `${pricingTotal.totalOptionPrice}`,
    };
  }

  private initFields() {
    this.fields = [
      { name: 'option', display: 'Option #' },
      { name: 'description', display: 'Description' },
      { name: 'price', display: 'Price', type: 'number' },
    ];
  }

  onSubmit() {
    this.pricingService
      .submitPricing(this.pricingToSubmit, this.specUid, this.uid)
      .pipe(this.takeUntilDestroy())
      .subscribe((result) => {
        this.snackBar.open('Pricing has been submitted for review');
        this.onNoClick();
      });
  }
  onNoClick() {
    this.dialogService.closeActiveDialog();
  }
}
