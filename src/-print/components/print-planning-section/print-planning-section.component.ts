import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-print-planning-section',
  templateUrl: './print-planning-section.component.html',
  styleUrls: ['./print-planning-section.component.scss']
})
export class PrintPlanningSectionComponent {
  @Input() spec: any;
  @Input() section: any;
  @Input() signed: any;
  @Input() showSign: boolean;
}
