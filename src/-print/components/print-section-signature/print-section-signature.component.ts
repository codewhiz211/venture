import { Component, Input } from '@angular/core';

import { DrawerContent } from '@shell/drawer/drawer-content.type';
import { DrawerService } from '@shell/drawer/drawer.service';
import { SignatureSignComponent } from '@shared/components/signature-sign/signature-sign.component';
import { sectionConfig } from '@shared/config/spec-config';

@Component({
  selector: 'ven-print-section-signature',
  templateUrl: './print-section-signature.component.html',
  styleUrls: ['./print-section-signature.component.scss'],
})
export class PrintSectionSignatureComponent {
  @Input() spec: any;
  @Input() section: any;
  @Input() signed: any;

  public todayDate = Date.now();
  public sections = sectionConfig;

  constructor(private drawerService: DrawerService) {}

  public openModalSign() {
    this.drawerService.open(
      new DrawerContent(SignatureSignComponent, {
        signature: this.spec[this.section.name].signature,
        spec: this.spec,
        sectionName: this.section.name,
      })
    );
  }
}
