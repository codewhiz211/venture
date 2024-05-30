import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Inject, OnDestroy, Optional } from '@angular/core';
import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCalendar, MatCalendarHeader, MatDatepickerIntl } from '@angular/material/datepicker';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WindowService } from '@services/window.service';
import { JobsService } from '@jobs/services/jobs.service';

@Component({
  selector: 'ven-card-calendar-header',
  templateUrl: './card-calendar-header.component.html',
  styleUrls: ['./card-calendar-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

//@ts-ignore
export class CardCalendarHeaderComponent<D> extends MatCalendarHeader<D> implements OnDestroy {
  public _buttonDescriptionId;

  private _destroyed = new Subject<void>();
  constructor(
    private _intl: MatDatepickerIntl,
    @Inject(forwardRef(() => MatCalendar)) public calendar: MatCalendar<D>,
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    cd: ChangeDetectorRef,
    private jobsService: JobsService
  ) {
    super(_intl, calendar, _dateAdapter, _dateFormats, cd);

    calendar.stateChanges.pipe(takeUntil(this._destroyed)).subscribe(() => cd.markForCheck());
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  previousClicked() {
    //
    this.handleMonthChanged(false);
    //mat-calendar
    super.previousClicked();
  }

  nextClicked() {
    this.handleMonthChanged(true);
    //mat-calendar
    super.nextClicked();
  }

  private handleMonthChanged(flag: boolean) {
    //@ts-ignore
    this.jobsService.loadScheduleByMonth(this._dateAdapter.addCalendarMonths(this.calendar.activeDate, flag ? 1 : -1));
  }
}
