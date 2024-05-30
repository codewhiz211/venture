import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { FileService } from 'src/+files/src/services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpecService } from '@services/spec/spec.service';

@Component({
  selector: 'ven-spec-attach-image',
  templateUrl: './spec-attach-image.component.html',
  styleUrls: ['./spec-attach-image.component.scss'],
})
export class SpecAttachImageComponent implements OnInit {
  @Input() public specId;
  @Input() public section;
  public files;
  public folder;
  public loading: boolean = false;

  constructor(
    private fileService: FileService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private specService: SpecService
  ) {}

  ngOnInit() {
    this.folder = this.section.id;
    this.getFiles();
  }

  public getFiles() {
    this.loading = true;
    this.fileService.getSectionFiles(this.specId, this.folder).subscribe(
      (res) => {
        this.files = res;
        this.loading = false;
        this.cd.detectChanges();
      },
      (err) => {
        this.loading = false;
        this.cd.detectChanges();
      }
    );
  }

  public downloadFile(file) {
    this.fileService.downloadFile(file.url, file.filename);
  }

  public deleteFile(file) {
    this.fileService.deleteFile(this.specId, this.folder, file.fuid).then(() => {
      this.files = this.files.filter((el) => {
        return el.fuid !== file.fuid;
      });
      if (!this.files.length) {
        this.specService.updateSection(this.specId, this.section.name, { hasFiles: false }).subscribe();
      }
      this.cd.detectChanges();
      this.snackBar.open('File was deleted', undefined, {
        duration: 2000,
      });
    });
  }

  public onFileUploaded(files) {
    this.specService.updateSection(this.specId, this.section.name, { hasFiles: true }).subscribe();
    this.files.push(...files);
    this.snackBar.open((files.length > 1 ? 'Files' : 'File') + ' was added', undefined, {
      duration: 2000,
    });
    this.cd.detectChanges();
  }
}
