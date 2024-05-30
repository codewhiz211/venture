import { Component, Input, OnInit } from '@angular/core';

import { FolderService } from '../../services/folder.service';

@Component({
  selector: 'ven-files-container',
  templateUrl: './files-container.component.html',
  styleUrls: ['./files-container.component.scss'],
})
export class FileContainerComponent implements OnInit {
  @Input() specUid: any;

  public folders: any[];
  public currentFolder: string = 'root';

  constructor(private folderService: FolderService) {}

  ngOnInit() {
    this.folderService.folders.subscribe((folders) => (this.folders = folders));
    this.folderService.getFolders(this.specUid);
  }
}
