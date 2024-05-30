import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '@shared/components/base.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { EditQuoteComponent } from '@shell/drawer/edit-quote/edit-quote.component';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecService } from '@services/spec/spec.service';

@Component({
  selector: 'app-quote-tab-content',
  templateUrl: './quote-tab-content.component.html',
  styleUrls: ['./quote-tab-content.component.scss'],
})
export class QuoteTabContentComponent extends BaseComponent implements OnInit {
  @Input() data;

  public spec;
  public customValues;

  constructor(private specService: SpecService, private specActiveService: SpecActiveService, private dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.spec = this.data.spec;
    this.specActiveService.activeSpec$.pipe(this.takeUntilDestroy()).subscribe((spec) => {
      this.initValues(spec);
    });
  }

  private initValues(spec) {
    if (!spec) {
      return;
    }
    this.spec = spec;
    this.spec.quote.includeGST = this.spec.quote.includeGST || true;
    this.customValues = this.specService.getCustomOptions();
  }

  saveQuote(quote) {
    this.specService.updateQuote(this.spec.uid, quote).subscribe();
  }

  openEditQuote() {
    this.dialogService.open(EditQuoteComponent, {
      data: {
        uid: this.spec.uid,
        spec: this.spec,
        quote: this.spec.quote,
        quoteTab: true,
      },
      dialogTitle: 'Edit Quote',
    });
  }
}
