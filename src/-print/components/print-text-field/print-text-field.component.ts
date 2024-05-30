import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-print-text-field',
  templateUrl: './print-text-field.component.html',
  styleUrls: ['./print-text-field.component.scss']
})
export class PrintTextFieldComponent {
  @Input() section: any;
  @Input() spec: any;
  @Input() field: any;
}
