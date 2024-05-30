import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '@shared/components/base.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { FolderService } from 'src/+files/src/services/folder.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-files-tab-content',
  templateUrl: './files-tab-content.component.html',
  styleUrls: ['./files-tab-content.component.scss'],
})
export class FilesTabContentComponent extends BaseComponent implements OnInit {
  @Input() specUid;

  public currentFolder$;

  constructor(private folderService: FolderService) {
    super();
  }

  ngOnInit(): void {
    this.currentFolder$ = this.folderService.currentFolder;
  }

  onAddFolder() {
    // check to see if New Folder
    let newFolderName = 'New Folder';

    // check to see if new folder name already exists
    // if it does, rename as duplicate folder
    this.folderService.folders.pipe(first()).subscribe((folders) => {
      if (folders.indexOf(newFolderName) > -1) {
        const length = folders.filter((folder) => folder.indexOf(newFolderName) > -1).length;
        newFolderName = `${newFolderName}(${length})`;
      }

      this.folderService.addFolder(this.specUid, newFolderName).then(() => {
        this.folderService.getFolders(this.specUid);
      });
    });
  }

  public handleUploaded(res) {}

  public handleUploading(uploading) {
    console.log(uploading);
  }
}
