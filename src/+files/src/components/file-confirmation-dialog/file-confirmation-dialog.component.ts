import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { APP_CONFIG } from 'app.config';

export interface DialogData {
  files: File[];
}

@Component({
  selector: 'ven-file-confirmation-dialog',
  templateUrl: './file-confirmation-dialog.component.html',
  styleUrls: ['./file-confirmation-dialog.component.scss'],
})
export class FileConfirmationDialogComponent implements OnInit {
  private config;
  public files: File[];
  public editMode = {};
  public isEditing = false;
  public isMobile: boolean;
  public filename = new FormControl('', [Validators.required]);

  private MAX_UPLOAD_SIZE: number;
  // tslint:disable-next-line
  private allowedMimes = /(message\/rfc822|text\/plain|text\/html|image\/jpg|image\/png|image\/bmp|image\/jpeg|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/vnd.openxmlformats-officedocument.wordprocessingml.template|application\/vnd.ms-excel|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application\/vnd.ms-powerpoint|application\/vnd.openxmlformats-officedocument.presentationml.presentation|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)/;

  constructor(
    @Inject(APP_CONFIG) config,
    public dialogRef: MatDialogRef<FileConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.config = config;
    this.MAX_UPLOAD_SIZE = config.maxImageUploadBytes;
  }

  ngOnInit() {
    const files = this.data.files;
    files.forEach((file: any, index: number) => {
      file.fileSize = this.formatBytes(file.size, 1);
      file.invalid = this.validateFile(file);
      this.editMode[index] = false;
    });
    this.files = files;
  }

  onEditFileName(index) {
    this.editMode[index] = true;
    this.isEditing = true;
  }

  onCancelFilename(index) {
    this.editMode[index] = false;
    this.isEditing = false;
    this.filename.setValue(undefined);
  }

  onSaveFilename(index) {
    const file: any = this.files[index];
    const fileExtension = file.name.substr(file.name.lastIndexOf('.'));
    file.newname = `${this.filename.value}${fileExtension}`;
    this.editMode[index] = false;
    this.isEditing = false;
    const newFile = new File([file], file.newname, { type: file.type });
    this.files[index] = newFile;
    this.dialogRef.close({ files: this.files });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onRemoveFile(index) {
    this.files.splice(index, 1);
  }

  canUpload() {
    return this.files.length > 0 && this.files.filter((f: any) => f.invalid !== undefined).length === 0;
  }

  private validateFile(file) {
    if (file.size > this.MAX_UPLOAD_SIZE) {
      return `Max size allowed is ${this.MAX_UPLOAD_SIZE / 1000000}MB`;
    }
    if (!file.type.match(this.allowedMimes)) {
      return `Invalid File Type`;
    }
    return undefined;
  }

  private formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
