import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-print-colour',
  templateUrl: './print-colour.component.html',
  styleUrls: ['./print-colour.component.scss']
})
export class PrintColourComponent {
  @Input() section: any;
  @Input() spec: any;
  @Input() field: any;
}
