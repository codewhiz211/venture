import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-print-image',
  templateUrl: './print-image.component.html',
  styleUrls: ['./print-image.component.scss']
})
export class PrintImageComponent {
  @Input() section: any;
  @Input() spec: any;
  @Input() field: any;
}
