import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ven-details-view-button',
  templateUrl: './details-view-button.component.html',
  styleUrls: ['./details-view-button.component.scss'],
})
export class DetailsViewButtonComponent {
  @Input() title: string;
  @Input() routeArray;
  @Input() saved: boolean = false;
  @Input() hideIcon: boolean = false;
  @Output() saveToggled = new EventEmitter();
  @Output() onTitleClicked = new EventEmitter();

  constructor() {}

  public toggleSavedStatus() {
    this.saved = !this.saved;
    this.saveToggled.emit(this.saved);
  }
}
