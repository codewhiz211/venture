import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ven-menu',
  templateUrl: './ven-menu.component.html',
  styleUrls: ['./ven-menu.component.scss'],
})
export class VenMenuComponent {
  @Input() menuItems;
  @Output() menuSelected = new EventEmitter();
}
