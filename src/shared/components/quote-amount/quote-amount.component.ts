import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ClientSpec } from '@interfaces/client-spec.interface';
import { ExtrasService } from '@services/spec/extras.service';
import { QuoteService } from '@services/spec/quote.service';

@Component({
  selector: 'ven-quote-amount',
  templateUrl: './quote-amount.component.html',
  styleUrls: ['./quote-amount.component.scss'],
})
export class QuoteAmountComponent implements OnChanges {
  @Input() spec: ClientSpec;
  public quote: any = {
    build: {},
    land: {},
    commitment: {},
    turnKey: {},
    extrasList: [],
    gross: 0,
    net: 0,
    gst: 0,
    totalBuild: {},
  };

  public extras: any[] = [];

  constructor(private quoteService: QuoteService, private extrasService: ExtrasService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['spec']) {
      this.calculateAmounts(changes['spec'].currentValue);
    }
  }

  private calculateAmounts(spec) {
    if (!spec || !spec.quote) {
      return;
    }

    // quote should always be done with pre contract extras
    this.extras = this.extrasService.getAllExtras(this.spec).filter((e) => !e.postContract);

    this.quote = this.quoteService.getQuote(
      this.spec.quote.paymentMethod,
      this.spec.quote.landPrice,
      this.spec.quote.buildPrice,
      this.spec.quote.initialCommitment,
      this.spec.quote.turnkeyFee,
      this.spec.quote.autoCalcTurnkey,
      this.spec.details.specVersion,
      this.extras
    );
  }
}
