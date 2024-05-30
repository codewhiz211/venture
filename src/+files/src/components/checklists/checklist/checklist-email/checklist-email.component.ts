import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';

import { ChecklistEmailDialogComponent } from './checklist-email-dialog/checklist-email-dialog.component';

@Component({
  selector: 'ven-checklist-email',
  templateUrl: './checklist-email.component.html',
  styleUrls: ['./checklist-email.component.scss'],
})
export class ChecklistEmailComponent implements OnInit {
  @Input() checklist;
  @Input() specId;
  @Input() emails: string[];
  clientEmails: string;
  constructor(private dialogService: DialogService) {}

  ngOnInit() {
    if (this.emails && this.emails.length > 0) {
      this.clientEmails = this.emails && this.emails.length > 1 ? this.emails.join(',') : this.emails[0];
    } else {
      this.clientEmails = null;
    }
  }

  openShareChecklistModal() {
    this.dialogService.open(ChecklistEmailDialogComponent, {
      data: {
        checklistName: this.checklist.name,
        clientEmails: this.clientEmails,
        checklists: [this.checklist],
        specId: this.specId,
      },
      dialogTitle: `Email ${this.checklist.name}`,
      size: DialogSize.Large,
    });
  }
}
