import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { DialogService } from '@shell/dialogs/dialog.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {
  @Input() data;
  public submitAction = {
    label: 'SAVE',
    handler: () => this.onSave(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onNoClick(),
  };

  public noteControl: FormControl;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    this.noteControl = new FormControl(this.data?.note || '', Validators.required);
  }

  private onSave() {
    this.dialogService.closeActiveDialog({ note: this.noteControl.value, id: this.data?.id });
  }

  private onNoClick() {
    this.dialogService.closeActiveDialog();
  }
}
