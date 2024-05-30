import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-print-text-area',
  templateUrl: './print-text-area.component.html',
  styleUrls: ['./print-text-area.component.scss']
})
export class PrintTextAreaComponent {
  @Input() field: any;
  @Input() highlight: boolean;
  @Input() label: string;
  @Input() value: string;
}
