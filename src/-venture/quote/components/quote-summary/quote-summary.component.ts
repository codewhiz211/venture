import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-quote-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.scss'],
})
export class QuoteSummaryComponent {
  @Input() spec: any;

  constructor() {}
}
