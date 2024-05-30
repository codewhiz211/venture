import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SummaryCardComponent {
  @Input() status;
  @Input() id;
  @Input() description;
  @Input() chips;
}
