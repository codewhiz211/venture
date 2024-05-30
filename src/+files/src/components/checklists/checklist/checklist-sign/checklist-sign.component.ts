import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';

import { DrawerContent } from '@shell/drawer/drawer-content.type';
import { DrawerService } from '@shell/drawer/drawer.service';
import { SignatureSignComponent } from '@shared/components/signature-sign/signature-sign.component';

@Component({
  selector: 'ven-checklist-sign',
  templateUrl: './checklist-sign.component.html',
  styleUrls: ['./checklist-sign.component.scss'],
})
export class ChecklistSignComponent implements OnInit {
  @Input() signed;
  @Output() onSigned = new EventEmitter();
  public signaturePath;
  public todayDate = Date.now();
  public signedChecklist;

  constructor(private dialogService: DialogService) {}

  ngOnInit() {
    this.signedChecklist = this.signed;
  }

  public openModalSign() {
    this.dialogService.open(SignatureSignComponent, {
      data: {
        signature: this.signaturePath || this.signedChecklist,
      },
      dialogTitle: 'Electronic signature',
      options: { autoFocus: false },
      size: DialogSize.Large,
    });
    this.dialogService.events$.subscribe((event: any) => {
      this.signedChecklist = this.signaturePath = event.data.signature;
      this.onSigned.emit(this.signaturePath);
    });
  }
}
