import { Component, Input, OnInit } from '@angular/core';

import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '@shell/drawer/drawer.service';

export interface DialogData {
  other: string;
}

@Component({
  selector: 'other-dialog',
  templateUrl: 'other-dialog.html',
  styleUrls: ['./other-dialog.scss'],
})
export class OtherDialog implements OnInit {
  @Input() data: any;

  public ready = false;
  public other: string;

  constructor(private dialogService: DialogService) {}

  ngOnInit() {
    this.ready = true;
    // @ts-ignore
    this.other = this.data?.value;
  }

  public submitAction = {
    label: 'SAVE',
    handler: () => this.handleSubmit(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.handleClose(),
  };

  private handleClose() {
    this.dialogService.closeActiveDialog();
  }

  private handleSubmit() {
    this.dialogService.closeActiveDialog(this.other);
  }

  onKeyUp($event: KeyboardEvent) {
    if ($event.keyCode === 13 && this.ready) {
      this.dialogService.closeActiveDialog(this.other);
    }
  }
}
