import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ven-extra-amount',
  templateUrl: './extra-amount.component.html',
  styleUrls: ['./extra-amount.component.scss'],
})
export class ExtraAmountComponent implements OnInit {
  @Input() amount;
  @Input() isAddedInQuote;
  public amountType;

  constructor() {}

  ngOnInit(): void {
    this.amountType = typeof this.amount;
  }
}
