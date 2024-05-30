import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ven-print-electrical-section',
  templateUrl: './print-electrical-section.component.html',
  styleUrls: ['./print-electrical-section.component.scss']
})
export class PrintElectricalSectionComponent implements OnChanges {
  @Input() spec: any;
  @Input() extras: any[];
  @Input() section: any;
  @Input() signed: any;
  @Input() showSign: boolean;

  manualPackage: number;
  print = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['spec']) {
      this.manualPackage = this.spec['electrical']['electricalPackage'];
    }
  }

  getFieldValue(section, field) {
    if (!this.spec[section.name]) {
      return 'n/a';
    }
    return this.spec[section.name][field.name] ? this.spec[section.name][field.name] : 'n/a';
  }
}
