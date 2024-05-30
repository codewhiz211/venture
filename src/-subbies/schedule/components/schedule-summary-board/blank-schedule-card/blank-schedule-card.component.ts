import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'ven-subbie-blank-schedule-card',
  templateUrl: './blank-schedule-card.component.html',
  styleUrls: ['./blank-schedule-card.component.scss'],
})
export class BlankScheduleCardComponent implements OnChanges {
  @Input() activeDate;
  public thisMonth;

  ngOnChanges() {
    this.thisMonth = new Date(this.activeDate).toLocaleDateString('EN', { month: 'long' });
  }
}
