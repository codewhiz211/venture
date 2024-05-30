import { CheckItemType, Checklist } from '@interfaces/checklist.data';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { AddChecklistItemDialog } from './add-checklist-item-dialog/add-checklist-item-dialog.component';
import { ChecklistSignComponent } from './checklist-sign/checklist-sign.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { SpecActiveService } from '@services/spec/spec.active.service';

@Component({
  selector: 'ven-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
})
export class ChecklistComponent implements OnInit, OnChanges {
  @Input() checklist: Checklist;
  @Output() updateChecklistChange = new EventEmitter();
  public itemTypeEnum = CheckItemType;
  itemsModel;
  progress: string;
  spec: any;
  displayEmailComponent = true;
  checklistLength: number = 0;
  @ViewChild('checklistSign', { static: true }) checklistSign: ChecklistSignComponent;

  constructor(private dialogService: DialogService, private specActiveService: SpecActiveService) {
    this.specActiveService.activeSpec$.subscribe((spec: any) => (this.spec = spec));
  }

  ngOnInit() {
    this.setupModel(this.checklist);
    this.checklist.items.forEach((item) => {
      item['actionRequired'] = !!item['actionRequired'];
      if (item.type === CheckItemType.call) {
        return (this.displayEmailComponent = false);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['checklist']) {
      this.setupModel(changes['checklist'].currentValue);
    }
  }

  onActionRequiredTextChange(event, i) {
    this.onModelChange(this.itemsModel);
  }

  checkActionRequired() {
    let actionRequired = false;
    for (let j = 0; j < this.checklist.items.length; j++) {
      if (this.checklist.items[j]['actionRequired']) {
        actionRequired = true;
        break;
      }
    }
    return actionRequired;
  }

  openFailedText(event, i) {
    event.stopPropagation();
    const el = this.checklist.items[i];
    el['actionRequired'] = !el['actionRequired'];
    if (el['actionRequired']) {
      el.complete = false;
      this.itemsModel = this.itemsModel.filter((item) => item !== el.name);
    } else {
      el.actionRequiredText = '';
    }
    this.onModelChange(this.itemsModel);
  }

  onModelChange(e) {
    // Go through each checklist item and set correct ones to complete
    const updatedItems = [];
    this.checklist.items.forEach((item) => {
      const updatedItem = item;
      updatedItem.complete = e.includes(item.name);
      if (updatedItem.complete && updatedItem.actionRequired) {
        updatedItem.actionRequired = false;
      }
      updatedItems.push(updatedItem);
    });
    const actionRequired = this.checkActionRequired();
    const typesNotIncluded = [CheckItemType.note, CheckItemType.heading];
    // remove the further action if false so we get correct count
    const checkListLength = this.checklist.items.filter(
      (i) => !(i.complete === false && i.furtherAction === false) && !typesNotIncluded.includes(i.type)
    ).length;
    // Update checklist props
    const updatedChecklist: Checklist = {
      name: this.checklist.name,
      items: updatedItems,
      length: checkListLength,
      actionRequired,
      completed: e.length,
      complete: e.length >= this.checklist.length,
      signed: this.checklist.signed,
    };
    // Make sure model matches persisted data
    this.setupModel(updatedChecklist);
    // Tell parent about the changes
    this.updateChecklistChange.emit(updatedChecklist);
  }

  setupModel(checklist) {
    this.itemsModel = checklist.items.filter((item) => item.complete).map((val) => val.name);
    this.updateProgress(checklist.completed, checklist.length);
    this.checklistLength = checklist.length;
  }

  updateProgress(completed, length) {
    this.progress = `${(completed / length) * 100}`;
  }

  onAddItemToList() {
    this.showNewItemDialog().subscribe((data) => {
      // Create item using the returned data
      if (data) {
        const newItem = data;
        const updatedChecklist = this.checklist;
        // Add the item to the checklist.items
        updatedChecklist.items.push(newItem);
        // Increase checklist length by 1
        updatedChecklist.length++;
        // Update checklist
        this.setupModel(updatedChecklist);
        this.updateChecklistChange.emit(updatedChecklist);
      }
    });
  }

  openModalSign() {
    this.checklistSign.openModalSign();
  }

  onSignedChecklist(data) {
    this.checklist['signed'] = data;
    this.onModelChange(this.itemsModel);
  }

  private showNewItemDialog() {
    return this.dialogService.open(AddChecklistItemDialog, { dialogTitle: 'Add a checklist item' });
  }
}
