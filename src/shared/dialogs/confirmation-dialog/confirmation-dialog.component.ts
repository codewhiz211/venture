import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DialogService } from '@shell/dialogs/dialog.service';

@Component({
  selector: 'ven-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  @Input() data;
  @Output() confirmed = new EventEmitter();
  public submitAction = {
    label: 'CONFIRM',
    handler: () => this.onConfirmed(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };

  constructor(private dialogService: DialogService) {}

  onCancelClick(): void {
    this.dialogService.closeActiveDialog();
  }

  onConfirmed(): void {
    this.dialogService.closeActiveDialog(true);
  }
}
