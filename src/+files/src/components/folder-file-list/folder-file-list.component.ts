import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Checklist } from '@interfaces/checklist.data';
import { ChecklistService } from '@services/checklist.service';
import { FOLDERS_NAMES } from '@shared/config/spec-config/folders.config';
import { FileService } from '../../services/file.service';
import { FolderService } from '../../services/folder.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShareService } from '@services/spec/share.service';
import ShareType from '@interfaces/share-type.enum';
import { WindowService } from '@services/window.service';
import createLogger from 'debug';
import { takeUntil } from 'rxjs/operators';

const logger = createLogger('ven:common:files');

@Component({
  selector: 'ven-folder-file-list',
  templateUrl: './folder-file-list.component.html',
  styleUrls: ['./folder-file-list.component.scss'],
})
export class FolderFileListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() specId: any;
  @Input() folders: any;
  @Output() folderChanged = new EventEmitter();
  @Output() folderRenamed = new EventEmitter();
  @Output() folderDeleted = new EventEmitter();

  public currentFolder: string;
  public placholderImage = '/assets/img/placeholder.png';
  public placholderEmail = '/assets/img/placeholder-email.png';
  public placholderPdf = '/assets/img/placeholder-pdf.png';
  public files$: any;
  public checklists: Checklist[];

  private activeFiles: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public readonly activeFiles$: Observable<any[]> = this.activeFiles.asObservable();

  public editingFolder: boolean = false;
  public description = new FormControl('', [Validators.required]);
  public checklist: any;
  public folderNames = FOLDERS_NAMES;
  public checklistsRequired: boolean = false;
  public editedSpec: string;

  private _destroy$ = new Subject<any>();

  constructor(
    private folderService: FolderService,
    private snackBar: MatSnackBar,
    private fileService: FileService,
    private windowService: WindowService,
    private checklistService: ChecklistService,
    private shareService: ShareService
  ) {}

  ngOnInit() {
    // we always want to start with the root folder
    if (this.folderService.getCurrentFolder !== 'root') {
      this.folderService.setCurrentFolder('root');
    }
    this.fileService.files.pipe(takeUntil(this._destroy$)).subscribe((files) => {
      logger(files);
      this.activeFiles.next(files);
    });
    this.checklistService
      .getAllChecklists(this.specId)
      .pipe(takeUntil(this._destroy$))
      .subscribe((checklists) => {
        this.checklists = checklists.sort((a, b) => (a.id > b.id ? 1 : -1));
        this.checkRequiredAction();
      });

    this.folderService.currentFolder.pipe(takeUntil(this._destroy$)).subscribe((folder) => {
      this.currentFolder = folder;
      this.getFilesByFolder(this.currentFolder);
    });
  }

  getFilesByFolder(folder) {
    if (folder) {
      this.fileService.getFolderFiles(this.specId, folder);
      if (folder === 'root') {
        this.checkRequiredAction();
      }
    }
  }

  checkRequiredAction() {
    if (this.checklists) {
      this.checklistsRequired = !!this.checklists.find((el) => el.actionRequired);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentFolder']) {
      this.fileService.getFolderFiles(this.specId, changes['currentFolder'].currentValue);

      if (changes['currentFolder'].currentValue === 'root') {
        this.checkRequiredAction();
      }
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  openFolder(folder) {
    if (this.editingFolder) {
      return;
    }
    this.currentFolder = folder.trim();
    this.folderService.setCurrentFolder(this.currentFolder);
  }

  onSetActiveChecklist(checklist) {
    this.checklist = checklist;
  }

  toPreview(file) {
    const shareLink = this.shareService.getShareUrl(this.specId, file.fuid, ShareType.Spec, []);
    this.windowService.windowRef.open(shareLink, '_blank');
  }

  onGoBack() {
    if (!this.checklist) {
      this.openFolder('root');
    } else {
      this.checklist = null;
    }
  }

  onHandleCurrentFolderClick() {
    if (this.checklist) {
      this.checklist = null;
    }
  }

  handleFolderChange(folder) {
    this.currentFolder = folder.trim();
    this.folderService.setCurrentFolder(this.currentFolder);
  }

  handleDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer !== event.container) {
      const fileId = event.item.element.nativeElement.id;
      const folderFrom = event.previousContainer.id;
      let folderTo = event.container.id;
      if (folderTo === 'base') {
        folderTo = 'root';
      }
      if (folderTo === folderFrom) {
        return;
      }
      // remove file from UI so user does not think nothing is happening
      const currentFiles = this.activeFiles.value;
      const indexOfFileToRemove = currentFiles.findIndex((f) => f.fuid === fileId);
      currentFiles.splice(indexOfFileToRemove, 1);
      this.activeFiles.next(currentFiles);

      let firstMessageDisplayed = false;
      // inform the user we are moving file, but only if the move takes a while (1sec)
      const timerId = setTimeout(() => {
        firstMessageDisplayed = true;
        this.snackBar.open(`Moving file from ${folderFrom} to ${folderTo}`);
      }, 1000);

      // move the file, then refresh the list
      this.fileService
        .moveFile(this.specId, fileId, folderFrom, folderTo)
        .then(() => {
          // clear timer to prevent first message displaying if has not already
          clearTimeout(timerId);
          this.fileService.getFolderFiles(this.specId, this.currentFolder);
          // if the first message has already displayed, delay the display of this message slightly
          setTimeout(() => this.snackBar.open(`File moved`), firstMessageDisplayed ? 2000 : 0);
        })
        .catch(() => this.snackBar.open('Failed to move file'));
    }
  }

  handleRenameFolder(folder) {
    this.editingFolder = folder;
  }

  handleFolderRenamed(newName) {
    // update name on server
    this.folderService.renameFolder(this.specId, this.editingFolder, newName).then(() => {
      this.editingFolder = undefined;
      this.folderService.getFolders(this.specId);
    });
  }

  handleFolderDelete(folder) {
    let firstMessageDisplayed = false;
    // inform the user we are deleting the folder, but only if the deletion takes a while (1sec)
    const timerId = setTimeout(() => {
      firstMessageDisplayed = true;
      this.snackBar.open(`Deleting folder ${folder}`);
    }, 1000);

    // update folders on server
    this.folderService.deleteFolder(this.specId, folder).then(() => {
      // clear timer to prevent first message displaying if has not already
      clearTimeout(timerId);
      // if the first message has already displayed, delay the display of this message slightly
      setTimeout(() => this.snackBar.open(`Folder deleted`), firstMessageDisplayed ? 2000 : 0);
      // remove folder from UI
      this.folders = this.folders.filter((name) => name !== folder);
      this.folderDeleted.emit();
    });
  }

  handleViewImage(url, filename) {
    const win = this.windowService.windowRef.open('', '_blank');
    win.document.body.innerHTML = `<html><head><title>${filename}</title></head><img src=${url}></html>`;
  }

  getFileName(url) {
    return url.replace(/^.*[\\\/]/, '');
  }

  handleDeleteFile(fuid, filename) {
    let firstMessageDisplayed = false;
    // inform the user we are deleting the file, but only if the deletion takes a while (1sec)
    const timerId = setTimeout(() => {
      firstMessageDisplayed = true;
      this.snackBar.open(`Deleting file ${filename}`);
    }, 1000);
    this.fileService.deleteFile(this.specId, this.currentFolder, fuid).then(() => {
      // clear timer to prevent first message displaying if has not already
      clearTimeout(timerId);
      // if the first message has already displayed, delay the display of this message slightly
      setTimeout(() => this.snackBar.open(`Deleted ${filename}`), firstMessageDisplayed ? 2000 : 0);
    });
  }

  handleDownloadFile(url, filename) {
    window.open(url, '_blank');
  }

  onUpdateChecklistChange(checklistChange) {
    const name = checklistChange.name;
    this.checklistService
      .updateChecklist(this.specId, name, checklistChange)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        const index = this.checklists.findIndex((cl) => cl.name === name);
        this.checklists[index] = checklistChange; // for some reason the returned value is not correct so use value for PATCH
      });
  }

  deleteSignedSpec(file) {
    this.fileService
      .deleteSignedSpec(file.uid, 'Signed spec sheets', file.fuid)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        let files = this.activeFiles.value;
        files = files.filter((item) => item.fuid !== file.fuid);
        this.activeFiles.next(files);
      });
  }

  renameSignedSpec(filename, file) {
    this.fileService
      .renameSignedSpec(file.uid, 'Signed spec sheets', file.fuid, filename)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        file.filename = filename;
        this.editedSpec = '';
      });
  }
}
