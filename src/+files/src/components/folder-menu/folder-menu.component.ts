import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ven-folder-menu',
  templateUrl: './folder-menu.component.html',
  styleUrls: ['./folder-menu.component.scss']
})
export class FolderMenuComponent {
  @Input() folder: string;
  @Output() renameFolderClicked = new EventEmitter();
  @Output() deleteFolderClicked = new EventEmitter();

  catchClick(event) {
    event.stopPropagation();
  }
}
