import { Component, Input } from '@angular/core';

import { DialogService } from '@shell/dialogs/dialog.service';

export interface ImageSelectDialogData {
  title: string;
  items: any[];
  selectedItem: any;
}

@Component({
  selector: 'ven-image-select-dialog',
  templateUrl: './image-select-dialog.component.html',
  styleUrls: ['./image-select-dialog.component.scss'],
})
export class ImageSelectDialogComponent {
  constructor(private dialogService: DialogService) {}

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.dialogService.closeActiveDialog(),
  };

  @Input() data;

  getUrl(imageId) {
    const items = this.data.items.filter((i) => i.id === imageId);
    return items && items.length > 0 ? items[0].url : '';
  }

  selectItem(item) {
    this.dialogService.closeActiveDialog(item);
  }
}
