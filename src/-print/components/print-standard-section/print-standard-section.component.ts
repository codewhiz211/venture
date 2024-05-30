import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { PLACEHOLDER_EMAIL, PLACEHOLDER_IMAGE, PLACEHOLDER_PDF } from '@shared/config/spec-config/base-imgs.config';

import { FileService } from 'src/+files/src/services/file.service';
import { PrintService } from '../../services/print.service';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-print-standard-section',
  templateUrl: './print-standard-section.component.html',
  styleUrls: ['./print-standard-section.component.scss'],
})
export class PrintStandardSectionComponent implements OnChanges {
  public placeholderImage = PLACEHOLDER_IMAGE;
  public placeholderEmail = PLACEHOLDER_EMAIL;
  public placeholderPdf = PLACEHOLDER_PDF;

  @Input() section: any;
  @Input() spec: any;
  @Input() extras: any;
  @Input() showTitle: boolean = true;
  @Input() signed: any;
  @Input() showSign: boolean;

  public printFields = [];

  constructor(
    private printService: PrintService,
    private fileService: FileService,
    private cd: ChangeDetectorRef,
    private windowService: WindowService
  ) {}

  ngOnChanges() {
    if (this.section['hasFiles']) {
      this.fileService.getSectionFiles(this.spec.uid, this.section.id).subscribe((files) => {
        const _section = { ...this.section };
        _section['fields'][0]['items'] = files;
        this.printFields = this.printService.getPrintFields(this.spec, _section);
        this.cd.detectChanges();
      });
    } else {
      this.printFields = this.printService.getPrintFields(this.spec, this.section);
    }
    this.getSubtitles(this.spec);
  }

  public openFile(file) {
    this.windowService.windowRef.open(file.url, '_blank');
  }

  public downloadFile(file) {
    this.fileService.downloadFile(file.url, file.filename);
  }

  public getSubtitles(spec) {
    // if the user has edited the field title (subtitle) we use that
    // else we default (in the template) to the configured field title
    const custom_fields = spec['custom_fields'];
    if (custom_fields && custom_fields[this.section.name]) {
      // TODO how is this working?? It's not returning the map?
      this.printFields.map((el) => {
        const name = el.name || el.text;
        const customTitle = custom_fields[this.section.name][name];
        if (customTitle) {
          el.text = customTitle;
        }
      });
    }
  }

  public highlightNote(field) {
    return (
      this.spec &&
      this.spec['highlighted_notes'] &&
      this.spec['highlighted_notes'][this.section.name] &&
      this.spec['highlighted_notes'][this.section.name][field]
    );
  }
}
