import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DialogService } from '@shell/dialogs/dialog.service';

@Component({
  selector: 'app-png-details',
  templateUrl: './png-details.component.html',
  styleUrls: ['./png-details.component.scss'],
})
export class PngDetailsComponent implements OnInit {
  @Input() data;

  public fields;

  public formController: FormGroup;

  public submitAction = {
    label: 'SAVE',
    handler: () => this.onAddRow(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onNoClick(),
  };

  constructor(private dialogService: DialogService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fields = this.data.rowFields;
    this.formController = this.createForm();
  }

  createForm() {
    const formObj = {};
    const row = this.data.row;
    this.fields.forEach((field) => {
      const value = row ? row[field.name] : field.defaultValue || '';
      formObj[field.name] = [value, Validators.required];
    });
    return this.fb.group(formObj);
  }

  onAddRow() {
    this.dialogService.closeActiveDialog({ ...this.data.row, ...this.formController.value });
  }

  onNoClick() {
    this.dialogService.closeActiveDialog();
  }
}
