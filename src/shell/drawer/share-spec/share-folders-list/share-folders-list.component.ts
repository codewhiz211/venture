import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ven-share-folders-list',
  templateUrl: './share-folders-list.component.html',
  styleUrls: ['./share-folders-list.component.scss'],
})
export class ShareFoldersListComponent implements OnChanges {
  @Input() files: any[];
  @Output() selectedFilesChanged = new EventEmitter();

  public panelOpenState = false;
  public selectAll: boolean = false;
  public attachedCount = 0;

  public folders: string[] = [];
  public rootFiles: any[] = [];
  public folderFiles: any;

  private selectedFiles = [];

  ngOnChanges(changes: SimpleChanges) {
    // root files are always displayed
    // folder files are intially hidden inside expansion panels
    if (changes['files']) {
      const newFiles = changes['files'].currentValue;
      if (newFiles != undefined) {
        this.folders = this.getFileFolders(newFiles);
        this.rootFiles = this.getRootFiles(newFiles);
        this.folderFiles = this.getFolderFiles(newFiles);
      }
    }
  }

  onSelectedFilesChanged(files) {
    if (files && files.length > 0) {
      // remove any files that match the folder changed
      const filesAreFromFolder = files[0].folder;
      const withoutUpdated = this.selectedFiles.filter((file) => file.folder !== filesAreFromFolder);
      // add in any that are now selected
      const newSelection = withoutUpdated.concat(files);
      // update state
      this.selectedFiles = newSelection.slice(0);

      this.selectedFilesChanged.emit(this.selectedFiles);
    }
  }

  private getFileFolders(files: any) {
    const folders = [];
    files.forEach((file) => {
      if (file.folder !== 'root') {
        if (folders.indexOf(file.folder) < 0) {
          folders.push(file.folder);
        }
      }
    });
    return folders;
  }

  private getRootFiles(files: any) {
    return files.filter((file) => file.folder === 'root');
  }

  private getFolderFiles(files: any) {
    const folderFiles = {};
    const nonRootFiles = files.filter((file) => file.folder !== 'root');
    nonRootFiles.forEach((file) => {
      if (folderFiles[file.folder] === undefined) {
        folderFiles[file.folder] = [];
      }
      folderFiles[file.folder].push(file);
    });
    return folderFiles;
  }
}
