import { Component, Input } from '@angular/core';
@Component({
  selector: 'ven-print-cover-page',
  templateUrl: './print-cover-page.component.html',
  styleUrls: ['./print-cover-page.component.scss']
})
export class PrintCoverPageComponent {
  @Input() spec: any;
  @Input() printSpec: boolean = false;
  @Input() printExtras: boolean = false;
  @Input() printQuote: boolean = false;

  public vdLogoImage = '/assets/img/vd-logo-black-text.png';
  public blueWaveImage = '/assets/img/blue-wave.png';
  public fpbLogoImage = '/assets/img/fpb-logo-black.png';
  public lpbLogoImage = '/assets/img/lpb-logo.png';
  public mbLogoImage = '/assets/img/mb-logo.png';
  public clientName: string;
  public clientAddress: string;

  ngOnInit() {
    if (this.spec) {
      this.clientName = this.spec.details.client;
      this.clientAddress = this.spec.section_details.address;
    }
  }
}
