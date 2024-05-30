import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ven-checklists',
  templateUrl: './checklists.component.html',
  styleUrls: ['./checklists.component.scss']
})
export class ChecklistsComponent {
  @Input() checklists;
  @Input() activeChecklist;
  @Output() activeChecklistChange = new EventEmitter();
  @Output() updateChecklistChange = new EventEmitter();

  onSetActiveList(event) {
    this.activeChecklistChange.emit(event);
  }

  onUpdateChecklistChange(event) {
    this.updateChecklistChange.emit(event);
  }
}
