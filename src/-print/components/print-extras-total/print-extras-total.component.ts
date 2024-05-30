import { Component, Input, OnInit } from '@angular/core';

import { ExtrasService } from '@services/spec/extras.service';
import { QuoteService } from '@services/spec/quote.service';

@Component({
  selector: 'ven-print-extras-total',
  templateUrl: './print-extras-total.component.html',
  styleUrls: ['./print-extras-total.component.scss'],
})
export class PrintExtrasTotalComponent implements OnInit {
  @Input() spec: any;

  totalPostExtras: number = 0;
  totalPreExtras: number = 0;
  total: number = 0;
  quote: any = {};

  constructor(private quoteService: QuoteService, private extrasService: ExtrasService) {}

  ngOnInit(): void {
    if (this.spec) {
      // these methods returns extras keyed by section, not a list of extras!
      this.total = 0;

      const postExtras = this.extrasService.getAllPostContractExtras(this.spec);
      this.totalPostExtras = this.quoteService.sumExtrasArray(postExtras, this.spec.quote['includeGST']);

      const preExtras = this.extrasService.getAllPreContractExtras(this.spec);
      this.totalPreExtras = this.quoteService.sumExtrasArray(preExtras);

      this.quote = this.quoteService.getQuote(
        this.spec.quote.paymentMethod,
        this.spec.quote.landPrice,
        this.spec.quote.buildPrice,
        this.spec.quote.initialCommitment,
        this.spec.quote.turnkeyFee,
        this.spec.quote.autoCalcTurnkey,
        this.spec.details.specVersion,
        preExtras
      );

      this.total = this.totalPostExtras + (this.spec.quote.includeGST ? this.quote.gross : this.quote.net);
    }
  }
}
