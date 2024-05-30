import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ClientSpec } from '@interfaces/client-spec.interface';
import { ExtrasService } from '@services/spec/extras.service';
import { QuoteService } from '@services/spec/quote.service';

/**
 * When the Project managers send out updates to their clients with the Extras that have 
 * been spend after the contract, the customer would also like to have a view on how much 
 * their total spend is so far.  
 * To give this view, can we add two extra lines to the bottom ‘Total’ section 
 * of the Extras tab  (to go below the ‘Total Extras’ line, but still in between 
 * the two darker dividing lines)

* Lines to add:
* ‘Contracted price’ (this is the total from the quote - including pre contract extras)
* ‘Total’ (this should be the quote total + Post Contract Extras total – this line should be bold)
 */
@Component({
  selector: 'ven-extras-list',
  templateUrl: './extras-list.component.html',
  styleUrls: ['./extras-list.component.scss'],
})
export class ExtrasListComponent implements OnChanges {
  @Input() spec: ClientSpec;
  @Input() sections;

  postExtrasForDisplay: any[];
  objectKeys = Object.keys;
  totalPostExtras: number = 0;
  totalPreExtras: number = 0;
  total: number = 0;
  postExtras: any = [];
  preExtras: any = [];
  quote: any = {};

  constructor(private extrasService: ExtrasService, private quoteService: QuoteService) {}

  ngOnChanges(changes: SimpleChanges) {
    const spec: any = changes['spec'].currentValue;

    if (spec) {
      this.total = 0;

      this.postExtrasForDisplay = this.extrasService.getPostContractExtras(spec, this.sections);

      this.postExtras = this.extrasService.getAllPostContractExtras(spec);
      this.preExtras = this.extrasService.getAllPreContractExtras(spec);

      this.totalPostExtras = this.quoteService.sumExtrasArray(this.postExtras, this.spec.quote['includeGST']);
      this.totalPreExtras = this.quoteService.sumExtrasArray(this.preExtras);

      // quote should always be done with pre contract extras
      this.quote = this.quoteService.getQuote(
        this.spec.quote.paymentMethod,
        this.spec.quote.landPrice,
        this.spec.quote.buildPrice,
        this.spec.quote.initialCommitment,
        this.spec.quote.turnkeyFee,
        this.spec.quote.autoCalcTurnkey,
        this.spec.details.specVersion,
        this.preExtras
      );

      this.total = this.totalPostExtras + (this.spec.quote.includeGST ? this.quote.gross : this.quote.net);
    }
  }
}
