import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@shared/dialogs/dialog-data.interface';

@Component({
  selector: 'ven-share-extras-dialog',
  templateUrl: './share-extras-dialog.component.html',
  styleUrls: ['./share-extras-dialog.component.scss'],
})
export class ShareExtrasDialogComponent {
  constructor(public dialogRef: MatDialogRef<ShareExtrasDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
