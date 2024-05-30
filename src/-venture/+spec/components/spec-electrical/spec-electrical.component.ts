import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { ClientSpec } from '@interfaces/client-spec.interface';
import { SectionConfig } from '../section-config.interface';

@Component({
  selector: 'ven-spec-electrical',
  templateUrl: './spec-electrical.component.html',
  styleUrls: ['./spec-electrical.component.scss'],
})
export class SpecElectricalComponent implements OnInit, OnChanges {
  @Input() spec: ClientSpec;
  @Input() sections: SectionConfig[] = [];

  public houseSize: number = 0;
  public infoField = { name: 'additionalInfo', display: 'Additional Info', type: 'textarea' };

  public section: SectionConfig;
  public manualPackage: number;
  print = false;

  constructor() {}

  ngOnInit() {
    this.section = this.sections.find((s) => s.name === 'electrical');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['spec']) {
      this.manualPackage = this.spec['electrical']['electricalPackage'];
    }
  }
}
