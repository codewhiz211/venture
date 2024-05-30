import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-saved-cards-board',
  templateUrl: './saved-cards-board.component.html',
  styleUrls: ['./saved-cards-board.component.scss'],
})
export class SavedCardsBoardComponent {
  @Input() savedItem;
  @Input() title;
  @Input() passages;
}
