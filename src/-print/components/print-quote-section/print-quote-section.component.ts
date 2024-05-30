import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-print-quote-section',
  templateUrl: './print-quote-section.component.html',
  styleUrls: ['./print-quote-section.component.scss']
})
export class PrintQuoteSectionComponent {
  @Input() spec: any;
}
