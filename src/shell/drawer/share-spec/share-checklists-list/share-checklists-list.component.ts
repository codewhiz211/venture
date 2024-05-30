import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ChecklistService } from '@services/checklist.service';

@Component({
  selector: 'ven-share-checklists-list',
  templateUrl: './share-checklists-list.component.html',
  styleUrls: ['./share-checklists-list.component.scss'],
})
export class ShareChecklistsListComponent implements OnInit {
  checklists: any[];
  @Input() specId: string;
  @Output() selectedChecklistsChanged = new EventEmitter();

  public panelOpenState = false;
  public selectAll: boolean = false;
  public attachedCount = 0;

  constructor(private checklistService: ChecklistService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.checklistService.getAllChecklists(this.specId).subscribe((checklists) => {
      this.checklists = checklists;
      this.cdRef.detectChanges();
    });
  }

  onSelectedChecklistsChanged() {
    this.attachedCount = this.checklists.filter((f) => f.checked === true).length;
    this.selectAll = this.attachedCount === this.checklists.length;
    this.selectedChecklistsChanged.emit(this.checklists.filter((f) => f.checked));
  }

  onSelectAll() {
    if (this.selectAll) {
      this.checklists.forEach((f) => (f.checked = true));
    } else {
      this.checklists.forEach((f) => (f.checked = false));
    }
    this.selectedChecklistsChanged.emit(this.checklists.filter((f) => f.checked));
  }
}
