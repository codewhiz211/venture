import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-checklist-heading',
  templateUrl: './checklist-heading.component.html',
  styleUrls: ['./checklist-heading.component.scss']
})
export class ChecklistHeadingComponent {
  @Input() item;
}
