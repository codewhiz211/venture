import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ven-pricing-rows',
  templateUrl: './pricing-rows.component.html',
  styleUrls: ['./pricing-rows.component.scss'],
})
export class PricingRowsComponent {
  @Input() columns;
  @Input() data;
  @Input() editable;
  @Output() onOperatorClicked = new EventEmitter();

  constructor() {}

  onAction(row, action) {
    this.onOperatorClicked.emit({ row, action });
  }
}
