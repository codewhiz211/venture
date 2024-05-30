import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DialogService } from '@shell/dialogs/dialog.service';

@Component({
  selector: 'ven-edit-admin-margin',
  templateUrl: './edit-admin-margin.component.html',
  styleUrls: ['./edit-admin-margin.component.scss'],
})
export class EditAdminMarginComponent implements OnInit {
  @Input() data;
  public adminMarginForm: FormGroup;

  public submitAction = {
    label: 'SAVE',
    handler: () => this.onSave(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onNoClick(),
  };

  constructor(private fb: FormBuilder, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.adminMarginForm = this.fb.group({
      margin: [this.data.margin * 100, Validators.required],
    });
  }

  onSave() {
    this.dialogService.closeActiveDialog(this.adminMarginForm.value.margin / 100);
  }

  onNoClick() {
    this.dialogService.closeActiveDialog();
  }
}
