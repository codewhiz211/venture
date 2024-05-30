import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { WindowService } from '../../services/window.service';

@Component({
  selector: 'ven-signature-sign-pad',
  templateUrl: './signature-sign-pad.component.html',
  styleUrls: ['./signature-sign-pad.component.scss'],
})
export class SignatureSignPadComponent implements AfterViewInit, OnInit {
  @ViewChild('signaturePad', { static: false }) signaturePad: SignaturePad;
  @ViewChild('el', { static: true }) el;
  @Output() signedImg = new EventEmitter();
  @Input() signatureSpec;
  public isMobile: boolean = false;

  public signaturePadOptions: Object = {
    minWidth: 1,
    canvasWidth: 400,
    canvasHeight: 300,
  };

  constructor(private windowService: WindowService) {}

  ngOnInit() {
    this.isMobile = this.windowService.isMobile;
    if (this.isMobile) {
      this.signaturePadOptions['canvasHeight'] = 150;
    }
    this.signaturePadOptions['canvasWidth'] = this.el.nativeElement.clientWidth;
  }

  ngAfterViewInit() {
    if (this.signatureSpec) {
      this.signaturePad.fromDataURL(this.signatureSpec);
    }
  }

  public drawComplete() {
    this.signedImg.emit(this.signaturePad.toDataURL('image/png'));
  }

  public clear() {
    this.signaturePad.clear();
  }
}
