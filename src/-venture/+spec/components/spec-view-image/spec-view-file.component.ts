import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PLACEHOLDER_EMAIL, PLACEHOLDER_IMAGE, PLACEHOLDER_PDF } from '@shared/config/spec-config/base-imgs.config';

import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-spec-view-file',
  templateUrl: './spec-view-file.component.html',
  styleUrls: ['./spec-view-file.component.scss'],
})
export class SpecViewFileComponent {
  public placeholderImage = PLACEHOLDER_IMAGE;
  public placeholderEmail = PLACEHOLDER_EMAIL;
  public placeholderPdf = PLACEHOLDER_PDF;

  @Input() public file;
  @Input() public notActions;

  @Output() onDeleteFile = new EventEmitter();
  @Output() onDownloadFile = new EventEmitter();

  constructor(private windowService: WindowService) {}

  public openFile() {
    this.windowService.windowRef.open(this.file.url, '_blank');
  }

  public deleteFile() {
    this.onDeleteFile.emit(this.file);
  }

  public downloadFile() {
    this.onDownloadFile.emit(this.file);
  }
}
