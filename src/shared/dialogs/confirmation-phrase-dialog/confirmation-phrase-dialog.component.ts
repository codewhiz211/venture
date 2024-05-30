import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../dialog-data.interface';

@Component({
  selector: 'ven-confirmation-phrase-dialog',
  templateUrl: './confirmation-phrase-dialog.component.html',
  styleUrls: ['./confirmation-phrase-dialog.component.scss'],
})
export class ConfirmationPhraseDialogComponent {
  public phrase = 'RESTORE';
  public confirmation = undefined;

  constructor(public dialogRef: MatDialogRef<ConfirmationPhraseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
