import { CheckItemType, ChecklistItem } from '@interfaces/checklist.data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Component } from '@angular/core';
import { DialogService } from '@shell/dialogs/dialog.service';

@Component({
  selector: 'app-add-checklist-item-dialog',
  templateUrl: './add-checklist-item-dialog.component.html',
  styleUrls: ['./add-checklist-item-dialog.component.scss'],
})
export class AddChecklistItemDialog {
  newItemGroup: FormGroup;

  public submitAction = {
    label: 'SAVE',
    handler: () => this.onAddItem(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onNoClick(),
  };

  constructor(private dialogService: DialogService, private fb: FormBuilder) {
    this.newItemGroup = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogService.closeActiveDialog();
  }

  onAddItem() {
    const newItem: ChecklistItem = {
      name: this.newItemGroup.value.name,
      complete: false,
      type: CheckItemType.item,
    };
    this.dialogService.closeActiveDialog(newItem);
  }
}
