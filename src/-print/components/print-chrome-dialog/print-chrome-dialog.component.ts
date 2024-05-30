import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WindowService } from '@services/window.service';
import { DialogData } from 'src/shared/dialogs/dialog-data.interface';

@Component({
  selector: 'ven-print-chrome-dialog',
  templateUrl: './print-chrome-dialog.component.html',
  styleUrls: ['./print-chrome-dialog.component.scss'],
})
export class PrintChromeDialogComponent {
  public url: string;
  constructor(
    public dialogRef: MatDialogRef<PrintChromeDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData,
    private snackBar: MatSnackBar,
    private windowService: WindowService
  ) {}

  ngOnInit() {
    this.url = this.data.link;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
