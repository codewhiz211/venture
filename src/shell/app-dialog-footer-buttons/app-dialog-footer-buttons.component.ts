import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-dialog-footer-buttons',
  templateUrl: './app-dialog-footer-buttons.component.html',
  styleUrls: ['./app-dialog-footer-buttons.component.scss'],
})
export class AppChromeDialogFooterButtonsComponent {
  @Input() closeAction: any;
  @Input() submitAction: any;
  @Input() disabled: boolean;
}
