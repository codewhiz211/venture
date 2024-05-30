import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ClientSpec } from '@interfaces/client-spec.interface';

@Component({
  selector: 'ven-quote-header',
  templateUrl: './quote-header.component.html',
  styleUrls: ['./quote-header.component.scss'],
})
export class QuoteHeaderComponent implements OnChanges {
  @Input() spec: ClientSpec;

  public todaysDate = Date.now();
  public consultantName: string;
  public consultantEmail: string;
  public clientEmails: string[];
  public clientPhones: string[];
  public logoImage = '/assets/img/pdf-logo.png';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['spec']) {
      const spec = changes['spec'].currentValue;
      if (spec) {
        this.clientEmails = spec.contact_details.emails ? spec.contact_details.emails.slice(0) : [];
        this.clientPhones = spec.contact_details.phones ? spec.contact_details.phones.slice(0) : [];
      }
    }
  }
}
