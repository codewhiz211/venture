import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { BaseComponent } from '@shared/components/base.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { NoteService } from 'src/-staff/services/note.service';

@Component({
  selector: 'app-pricing-note-choosing',
  templateUrl: './pricing-note-choosing.component.html',
  styleUrls: ['./pricing-note-choosing.component.scss'],
})
export class PricingNoteChoosingComponent extends BaseComponent implements OnInit {
  public notesForm: FormGroup;
  public notesValue;

  public submitAction = {
    label: 'ADD',
    handler: () => this.onSave(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onNoClick(),
  };

  constructor(private noteService: NoteService, private fb: FormBuilder, private dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.notesValue = this.noteService.notes;
    this.notesForm = this.fb.group({ notes: this.fb.array(this.notesValue.map((n) => new FormControl(false))) });
  }

  onSave() {
    const formValues = this.notesForm.value.notes;
    const chosenNotes = this.notesValue
      .filter((n, i) => formValues[i])
      .map((n) => n.note)
      .join('\n');
    this.dialogService.closeActiveDialog(chosenNotes);
  }

  onNoClick() {
    this.dialogService.closeActiveDialog();
  }
}
