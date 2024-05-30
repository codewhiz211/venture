import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthService } from '@auth/services/auth.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { ShareService } from '@services/spec/share.service';
import ShareType from '@interfaces/share-type.enum';

@Component({
  selector: 'ven-checklist-email-dialog',
  templateUrl: './checklist-email-dialog.component.html',
  styleUrls: ['./checklist-email-dialog.component.scss'],
})
export class ChecklistEmailDialogComponent implements OnInit {
  @Input() data: any;

  emailFormGroup: FormGroup;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter message here...',
    translate: 'no',
  };

  public submitAction = {
    label: 'SEND',
    handler: () => this.onShareItem(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onNoClick(),
  };

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private authService: AuthService,
    private shareService: ShareService
  ) {
    this.emailFormGroup = this.fb.group({
      to: ['', Validators.required],
      subject: ['', Validators.required],
      message: [],
    });
  }

  ngOnInit() {
    this.emailFormGroup.patchValue({
      to: this.data.clientEmails,
    });
  }

  onNoClick(): void {
    this.dialogService.closeActiveDialog();
  }

  onShareItem() {
    if (this.emailFormGroup.valid) {
      // checklists are not snapshot'd we just share whatever is current
      const fromAddress = this.authService.authUser?.email;
      const shareLink = this.shareService.getShareUrl(this.data.specId, -1, ShareType.Checklists, this.data.checklists);
      this.shareService.sendShareEmail(fromAddress, this.emailFormGroup.value, this.data.specId, shareLink);
      this.onNoClick();
    }
  }
}
