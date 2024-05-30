import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EVENT_TYPES, IDrawerContentComponent } from '@shell/drawer/drawer-content.interfaces';

import { DialogService } from '@shell/dialogs/dialog.service';
import { SignatureSignPadComponent } from '../signature-sign-pad/signature-sign-pad.component';

@Component({
  selector: 'ven-signature-sign',
  templateUrl: './signature-sign.component.html',
  styleUrls: ['./signature-sign.component.scss'],
})
export class SignatureSignComponent implements IDrawerContentComponent, OnInit, OnDestroy {
  @Input() data: any;

  public signature;
  public signatureSpec;
  public spec;
  public checkAll = false;

  private sectionName: string;

  @ViewChild('signPad', { static: true }) signPad: SignatureSignPadComponent;

  constructor(private dialogService: DialogService) {}

  ngOnInit() {
    this.setData();
  }

  ngOnDestroy() {
    this.dialogService.closeActiveDialog();
  }

  public onCancel(): void {
    this.dialogService.closeActiveDialog();
  }

  public onSubmit(): void {
    if (this.checkAll) {
      this.dialogService.raiseEvent(EVENT_TYPES.signAll, this.signature);
    } else {
      this.dialogService.raiseEvent(EVENT_TYPES.signSection, { sectionName: this.sectionName, signature: this.signature });
    }
    this.dialogService.closeActiveDialog();
  }

  public onSignedImg(signature): void {
    this.signature = signature;
  }

  public onClear(): void {
    this.signPad.clear();
    this.signature = '';
  }

  private setData() {
    this.signature = this.signatureSpec = this.data['signature'];
    this.spec = this.data['spec'];
    this.sectionName = this.data['sectionName'];
  }
}
