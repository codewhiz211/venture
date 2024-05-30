import { Component, Input } from '@angular/core';

/* This control is used to display extras in two scenarios.
   It displays both pre and post extras.

1) at the end of each spec section
2) as a standalone extras section

The rules for displaying the amount differ for each scenario

1) always display price including GST
2) only display price including GST if the Include GST checkbox is checked (in quote)

*/
@Component({
  selector: 'ven-print-extras-section',
  templateUrl: './print-extras-section.component.html',
  styleUrls: ['./print-extras-section.component.scss']
})
export class PrintExtrasSectionComponent {
  @Input() section: any;
  @Input() extras: any[];
  @Input() specStatus: boolean = false; //spec?.details.status == 'Prepared for contract' or false in extras print
  @Input() includeGST: boolean = true;
}
