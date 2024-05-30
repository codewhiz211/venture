import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DialogService } from '@shell/dialogs/dialog.service';

@Component({
  selector: 'ven-spec-edit-section',
  templateUrl: './spec-edit-section.component.html',
  styleUrls: ['./spec-edit-section.component.scss'],
})
export class SpecEditSectionComponent implements OnInit {
  @Input() data;

  public form: FormGroup;
  public submitAction = {
    label: 'SAVE',
    handler: () => this.handleSubmit(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.dialogService.closeActiveDialog(),
  };

  constructor(private fb: FormBuilder, private dialogService: DialogService) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
    });
  }

  private handleSubmit() {
    if (this.form.value.title) {
      this.dialogService.closeActiveDialog(this.form.value.title.trim());
    }
  }
}
