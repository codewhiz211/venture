import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { FileConfirmationDialogComponent } from '../../../+files/src/components/file-confirmation-dialog/file-confirmation-dialog.component';
import { FileService } from '../../../+files/src/services/file.service';
import { FileValidator } from '../../../+files/src/directives/file-required.validator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WindowService } from '@services/window.service';
import createLogger from 'debug';
import { APP_CONFIG } from 'app.config';

const logger = createLogger('ven:common');

@Component({
  selector: 'ven-file-uploader-engine',
  templateUrl: './file-uploader-engine.component.html',
  styleUrls: ['./file-uploader-engine.component.scss'],
})
export class FileUploaderEngineComponent implements OnInit {
  @Input() specId: string;
  @Input() folder: string;
  @Output() fileUploaded = new EventEmitter();
  @Output() uploading = new EventEmitter();
  private config;

  // tslint:disable-next-line
  public allowedFileTypes =
    // tslint:disable-next-line
    'message/rfc822, text/plain, text/html, image/png, image/jpeg, image/jpg, image/bmp, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.wordprocessingml.template, application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  // tslint:disable-next-line
  private allowedMimes =
    /(message\/rfc822|text\/plain|text\/html|image\/jpg|image\/png|image\/bmp|image\/jpeg|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/vnd.openxmlformats-officedocument.wordprocessingml.template|application\/vnd.ms-excel|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application\/vnd.ms-powerpoint|application\/vnd.openxmlformats-officedocument.presentationml.presentation|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)/;

  public isMobile = false;

  public form: FormGroup;
  private messages: string[] = [];
  private MAX_UPLOAD_SIZE: number;
  private MAX_NUMBER_IMAGES: number;

  constructor(
    @Inject(APP_CONFIG) config,
    public fb: FormBuilder,
    public dialog: MatDialog,
    private fileService: FileService,
    private snackBar: MatSnackBar,
    windowService: WindowService
  ) {
    this.config = config;
    this.MAX_UPLOAD_SIZE = config.maxImageUploadBytes;
    this.MAX_NUMBER_IMAGES = config.maxImageUploadCount;
    this.isMobile = windowService.isMobile;
  }

  ngOnInit() {
    this.form = this.fb.group({
      file: new FormControl('', [FileValidator.validate]),
    });
  }

  fileChange($event) {
    const fileList: FileList = $event.target.files;
    const files = Array.from(fileList);
    if (!files.length || files.length === 0) {
      return;
    }
    this.showfileList(files);
  }

  showfileList(files) {
    // show a dialog with user ability to remove / rename files
    // show any validation errors
    const dialogRef = this.dialog.open(FileConfirmationDialogComponent, {
      panelClass: 'full-width-dialog',
      width: this.isMobile ? '100%' : '50%',
      data: {
        files,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.clearForm();
      if (result) {
        this.uploadFiles(result);
      }
    });
  }

  validateFiles(files) {
    this.messages = [];
    if (files.length >= this.MAX_NUMBER_IMAGES) {
      this.messages.push(`maximum number of files that can be uploaded is ${this.MAX_NUMBER_IMAGES}`);
    }
    files.forEach((file) => {
      if (file.size > this.MAX_UPLOAD_SIZE) {
        this.messages.push(`File ${file.filename}, is too large (max upload size ${this.MAX_UPLOAD_SIZE / 1000000}MB)`);
      }
      if (!file.type.match(this.allowedMimes)) {
        // tslint:disable-next-line
        this.messages.push(`File ${file.filename}, must be an image (BPM, JPG, JPEG, PNG), document (PDF, DOC, XLS, PPT) or email`);
      }
    });
    return this.messages;
  }

  uploadFiles(result) {
    this.uploading.emit(true);
    const files = result.files;
    if (files.length === 0) {
      return;
    }

    // guard against file too large and incorrect type
    // if one or more errors we abandon upload
    this.messages = this.validateFiles(files);
    if (this.messages.length > 0) {
      this.messages.unshift('No files uploaded');
      this.snackBar.open(this.messages.join(' '), undefined, {
        duration: 5000,
      });
      return;
    }

    const uploaded = [];

    // it's not possible to have an indeterminate (indefinite) snack,
    // therefore use a long time (2 mins) and dimiss when load complete
    const msg = files.length > 1 ? 'Uploading files...' : 'Uploading file';
    this.snackBar.open(msg, undefined, {
      duration: 120000,
    });
    files.forEach((file) => {
      uploaded.push(this.uploadFile(file));
    });

    Promise.all(uploaded)
      .then((res) => {
        const msg = files.length > 1 ? 'All files uploaded' : 'File uploaded';
        this.snackBar.dismiss();
        this.clearForm();
        this.snackBar.open(msg, undefined, {
          duration: 2000,
        });
        this.fileUploaded.emit(res);
      })
      .catch((e) => {
        this.snackBar.dismiss();
        if (this.config.production) {
          this.snackBar.open('File upload failed', undefined, {
            duration: 5000,
          });
        } else {
          const error = e.message ? e.message : 'File upload failed';
          this.snackBar.open(error, undefined, {
            duration: 5000,
          });
        }
      });
  }

  uploadFile(file) {
    return this.fileService.uploadFile(this.specId, this.folder, file);
  }

  clearForm() {
    // this ensures that the same file(name) can be uploaded multiple times
    (this.form as FormGroup).setValue({ file: '' }, { onlySelf: true });
  }
}
