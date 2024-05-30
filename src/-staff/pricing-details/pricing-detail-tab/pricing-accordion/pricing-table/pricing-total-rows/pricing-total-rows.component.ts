import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-pricing-total-rows',
  templateUrl: './pricing-total-rows.component.html',
  styleUrls: ['./pricing-total-rows.component.scss'],
})
export class PricingTotalRowsComponent {
  @Input() rows;
  @Input() editable;
}
