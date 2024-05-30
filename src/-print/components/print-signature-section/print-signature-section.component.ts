import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DrawerContent } from '@shell/drawer/drawer-content.type';
import { DrawerService } from '@shell/drawer/drawer.service';
import { SignatureSignComponent } from '@shared/components/signature-sign/signature-sign.component';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-print-signature-section',
  templateUrl: './print-signature-section.component.html',
  styleUrls: ['./print-signature-section.component.scss'],
})
export class PrintSignatureSectionComponent {
  @Input() spec;
  @Input() signed: string; // will contain signature once submitted
  @Input() signature: string; //will contain signature once signed
  @Output() submit = new EventEmitter();

  public todaysDate = Date.now();
  public isMobile = false;

  constructor(private windowService: WindowService, public drawerService: DrawerService) {
    this.isMobile = this.windowService.isMobile;
  }

  public openModalSign() {
    this.drawerService.open(
      new DrawerContent(SignatureSignComponent, {
        signature: this.signature,
        spec: this.spec,
        sectionName: 'HealthAndSafety',
      })
    );
  }

  public onSubmit() {
    this.submit.emit(this.signature);
  }
}
