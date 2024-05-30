import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ven-pricing-status',
  templateUrl: './pricing-status.component.html',
  styleUrls: ['./pricing-status.component.scss'],
})
export class PricingStatusComponent implements OnInit {
  @Input() status;

  constructor() {}

  ngOnInit(): void {}
}
