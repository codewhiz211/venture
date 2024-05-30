import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ven-edit-extras',
  templateUrl: './edit-extras.component.html',
  styleUrls: ['./edit-extras.component.scss']
})
export class EditExtrasComponent implements OnChanges {
  @Input() extras: any;
  @Output() extrasModified: EventEmitter<object> = new EventEmitter();

  modifiedExtras = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['extras']) {
      this.extras.forEach((extra, idx) => {
        this.modifiedExtras[idx] = extra;
      });
    }
  }

  extraChanged(idx) {
    this.modifiedExtras[idx].modified = true;
    this.modifiedExtras[idx]['_amount'] = this.modifiedExtras[idx].amount;
    this.extrasModified.emit(this.modifiedExtras);
  }

  buildPriceChanged(event, idx) {
    if (event.checked && this.modifiedExtras[idx].amount) {
      this.modifiedExtras[idx]['_amount'] = this.modifiedExtras[idx].amount;
      this.modifiedExtras[idx].amount = 0;
    } else {
      this.modifiedExtras[idx].amount = this.modifiedExtras[idx]['_amount'] || 0;
    }
    this.modifiedExtras[idx].modified = true;
    this.extrasModified.emit(this.modifiedExtras);
  }
}
