import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ven-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {
  @Input() specId: string;
  @Input() folder: string;
  @Output() fileUploaded = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  public afterfileUploaded(res) {
    this.fileUploaded.emit(res);
  }
}
