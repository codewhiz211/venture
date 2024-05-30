import { Component, Input, OnInit } from '@angular/core';

import { PrintGroupedService } from './print-grouped.service';
import { PrintService } from '@print/services/print.service';

@Component({
  selector: 'ven-print-grouped-section',
  templateUrl: './print-grouped-section.component.html',
  styleUrls: ['./print-grouped-section.component.scss'],
})
/**
 * Same as standard section, with one key difference.
 * Content (fields) is organised into groups, with the subtitle used to determine where
 * one group starts and the next finishes.
 */
export class PrintGroupedSectionComponent implements OnInit {
  @Input() section: any;
  @Input() spec: any;
  @Input() showTitle: boolean = true;
  @Input() extras: any;
  @Input() signed: any;
  @Input() showSign: boolean;

  public groups;

  constructor(private printGroupedService: PrintGroupedService, private printService: PrintService) {}

  ngOnInit() {
    this.groups = this.printGroupedService.getGroups(this.spec, this.section);

    this.groups.map((group) => {
      const section = { name: this.section.name, fields: group.fields };
      group.fields = this.printService.getPrintFields(this.spec, section);

      if (this.spec['custom_fields']) {
        const custom_fields = this.spec['custom_fields'];
        const customSectionName = custom_fields[this.section.name];
        if (custom_fields && customSectionName && (customSectionName[group.title] || customSectionName[group.customSubtitle])) {
          if (customSectionName[group.customSubtitle]) {
            group.title = custom_fields[this.section.name][group.customSubtitle];
          } else {
            group.title = custom_fields[this.section.name][group.title];
          }
        }
      }
    });
  }
}
