import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AngularEditorConfig } from '@kolkov/angular-editor';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss'],
})
export class EmailFormComponent implements OnInit {
  @Input() email;
  @Input() emailData;
  @Output() formSubmitted = new EventEmitter();
  @Output() formCancelled = new EventEmitter();

  public isMobile = false;
  public form;
  public message: string;
  public loading = false;
  public errorMessage = '';

  public submitAction = {
    label: 'SEND',
    handler: () => this.onSaveClick(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };

  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter message here...',
    translate: 'no',
  };

  constructor(windowService: WindowService) {
    this.isMobile = windowService.isMobile;
  }

  ngOnInit() {
    this.form = this.emailData || {
      to: undefined,
      message: undefined,
      subject: undefined,
    };
  }

  onSaveClick() {
    this.formSubmitted.emit(this.form);
  }

  onCancelClick() {
    this.formCancelled.emit();
  }
}
