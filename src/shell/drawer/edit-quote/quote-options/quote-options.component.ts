import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ven-quote-options',
  templateUrl: './quote-options.component.html',
  styleUrls: ['./quote-options.component.scss'],
})
export class QuoteOptionsComponent implements OnInit {
  @Input() quote;
  @Output() valueChange = new EventEmitter();

  public payments = [
    { display: 'Turnkey Payment method', value: '1' },
    { display: 'Build Only', value: '2' },
    { display: 'Progress Payment method', value: '3' },
  ];

  public quoteForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.quoteForm = this.formBuilder.group({
      paymentMethod: [this.quote.paymentMethod, Validators.compose([Validators.required])],
      buildPrice: [this.quote.buildPrice, Validators.compose([Validators.required])],
      landPrice: [this.quote.landPrice, Validators.compose([Validators.required])],
      initialCommitment: [this.quote.initialCommitment, Validators.compose([Validators.required])],
    });

    this.quoteForm.get('paymentMethod').valueChanges.subscribe((val) => {
      const landPriceControl = this.quoteForm.get('landPrice');
      if (val === this.payments[1].display) {
        landPriceControl.setValidators(null);
      } else {
        landPriceControl.setValidators([Validators.required]);
      }
      landPriceControl.updateValueAndValidity();
    });
  }

  valueChanged(event) {
    this.valueChange.emit(this.quoteForm.value);
  }
}
