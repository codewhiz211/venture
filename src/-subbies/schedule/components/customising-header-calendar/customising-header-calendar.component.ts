import { Component, Input, OnInit } from '@angular/core';

import { CardCalendarHeaderComponent } from './card-calendar-header/card-calendar-header.component';
import { JobsService } from '@jobs/services/jobs.service';
import { WindowService } from '@services/window.service';
import { dayInMilliseconds } from '@jobs/constants';

@Component({
  selector: 'ven-customising-header-calendar',
  templateUrl: './customising-header-calendar.component.html',
  styleUrls: ['./customising-header-calendar.component.scss'],
})
export class CustomisingHeaderCalendarComponent implements OnInit {
  public headerComponent = CardCalendarHeaderComponent;
  //get scheduled date

  @Input() scheduledDates; // = [new Date('September 17, 2021 00:00:00'), new Date('September 23, 2021 00:00:00')] sample

  public isMobile;
  public today = Date.now();
  constructor(private windowService: WindowService, private jobsService: JobsService) {}

  ngOnInit(): void {
    this.isMobile = this.windowService.isMobile;
  }

  renderSelectedDates = (d: Date) => {
    const d1 = d.getTime();
    const filtered = this.scheduledDates.filter((sd: Date) => {
      return d.getFullYear() === sd.getFullYear() && d.getMonth() === sd.getMonth() && d.getDate() === sd.getDate();
    });
    let dateClass = this.isMobile ? '' : 'body-2 '; // font-size of cell
    if (filtered.length >= 1) {
      // mat-calendar-body-disabled is mainly used for diable :hover style
      dateClass += 'mat-calendar-body-disabled mat-calendar-body-selected ';
    }
    if (this.getOffsetDay(this.today, d1) > 1) {
      dateClass += 'mat-calendar-body-disabled disabled-cell-font ';
    }
    return dateClass;
  };

  handleMonthChanges(dateStr) {
    this.jobsService.loadScheduleByMonth(new Date(dateStr));
  }

  private getOffsetDay(d1, d2) {
    return (d1 - d2) / dayInMilliseconds;
  }
}
