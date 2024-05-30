import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-print-extras',
  templateUrl: './print-extras.component.html',
  styleUrls: ['./print-extras.component.scss']
})
export class PrintExtrasComponent {
  @Input() spec: any;
  @Input() extras: any;
  @Input() sections: any;
}
