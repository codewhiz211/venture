import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ven-fab-button',
  templateUrl: './ven-fab-button.component.html',
  styleUrls: ['./ven-fab-button.component.scss'],
})
export class VenFabButtonComponent {
  @Input() actionItem;
  @Input() labelOnButton;
}
