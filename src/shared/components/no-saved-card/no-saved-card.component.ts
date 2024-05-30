import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-no-saved-card',
  templateUrl: './no-saved-card.component.html',
  styleUrls: ['./no-saved-card.component.scss'],
})
export class NoSavedCardComponent {
  @Input() passages;
}
