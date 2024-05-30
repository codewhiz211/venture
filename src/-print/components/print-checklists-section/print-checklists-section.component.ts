import { CheckItemType, Checklist } from '@interfaces/checklist.data';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-print-checklists-section',
  templateUrl: './print-checklists-section.component.html',
  styleUrls: ['./print-checklists-section.component.scss'],
})
export class PrintChecklistsSectionComponent {
  @Input() checklists: Checklist[];
  itemTypeEnum = CheckItemType;
}
