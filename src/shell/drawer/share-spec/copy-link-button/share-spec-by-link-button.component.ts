import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ShareService } from '@services/spec/share.service';
import ShareType from '@interfaces/share-type.enum';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-share-spec-by-link-button',
  templateUrl: './share-spec-by-link-button.component.html',
})
export class ShareSpecByLinkButton implements OnChanges {
  @Output() copyComplete = new EventEmitter();
  @Input() specUid: string;
  @Input() snapUid: string;
  @Input() checklists: any[] = [];
  @Input() printItem: ShareType;
  @Input() disabled: boolean;

  constructor(private shareService: ShareService, private snackBar: MatSnackBar, private windowService: WindowService) {}

  private shareUrl: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.shareUrl = this.shareService.getShareUrl(this.specUid, this.snapUid, this.printItem, this.checklists);
    }
  }

  public onClick() {
    // in the past we had a different code path to support Safari & Firefox, however this appears to no longer be required,
    // since windowService.copyToClipboard() appears to work for both
    this.toClipboard();
  }

  private toClipboard() {
    if (this.shareUrl) {
      this.windowService.copyToClipboard(this.shareUrl);

      this.copyComplete.emit();

      this.snackBar.open('Added to clipboard', undefined, {
        duration: 2000,
      });
    }
  }
}
