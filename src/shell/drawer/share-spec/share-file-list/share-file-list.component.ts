import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ven-share-file-list',
  templateUrl: './share-file-list.component.html',
  styleUrls: ['./share-file-list.component.scss'],
})
export class ShareFileListComponent {
  @Input() files: any[];
  @Output() selectedFilesChanged = new EventEmitter();

  public selectAll: boolean = false;
  public attachedCount = 0;

  onFileSeletChange() {
    this.attachedCount = this.files.filter((f) => f.checked === true).length;
    this.selectAll = this.attachedCount === this.files.length;
    this.selectedFilesChanged.emit(this.files.filter((f) => f.checked));
  }

  onSelectAll() {
    if (this.selectAll) {
      this.files.forEach((f) => (f.checked = true));
    } else {
      this.files.forEach((f) => (f.checked = false));
    }
    this.selectedFilesChanged.emit(this.files.filter((f) => f.checked));
  }
}
