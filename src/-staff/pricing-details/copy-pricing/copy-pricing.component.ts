import { Component, OnInit } from '@angular/core';

import { DialogService } from '@shell/dialogs/dialog.service';

@Component({
  selector: 'app-copy-pricing',
  templateUrl: './copy-pricing.component.html',
  styleUrls: ['./copy-pricing.component.scss'],
})
export class CopyPricingComponent implements OnInit {
  public submitAction = {
    label: 'SUBMIT',
    handler: () => this.onSubmit(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onNoClick(),
  };

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  onSubmit() {}

  onNoClick() {
    this.dialogService.closeActiveDialog();
  }
}
