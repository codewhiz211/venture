import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../../dialogs/dialog-data.interface';

@Component({
  selector: 'ven-track-changes-modal',
  templateUrl: './track-changes-modal.component.html',
  styleUrls: ['./track-changes-modal.component.scss'],
})
export class TrackChangesModalComponent {
  constructor(public dialogRef: MatDialogRef<TrackChangesModalComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  closeModal(data?: string) {
    this.dialogRef.close(data);
  }
}
