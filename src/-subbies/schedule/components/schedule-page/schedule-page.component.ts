import { Component, OnInit } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';
import { BaseComponent } from '@shared/components/base.component';
import { JobsService } from '@jobs/services/jobs.service';
import { SubbieJobService } from '@services/spec/subbie-job.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ven-subbies-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss'],
})
export class SchedulePageComponent extends BaseComponent implements OnInit {
  public scheduledDates$;
  public loading = true;
  constructor(private jobsService: JobsService, private authService: AuthService, private subbieService: SubbieJobService) {
    super();
  }

  ngOnInit(): void {
    this.scheduledDates$ = this.jobsService.jobs$.pipe(
      this.takeUntilDestroy(),
      map((jobs) => {
        return this.jobsService.getScheduleDates(jobs);
      })
    );

    //get jobs information for schedule-page and customising-header-calendar
    const subbieUid = this.authService.authUser?.subbieUid;
    this.jobsService
      .loadAllJobsUnderSubbie(subbieUid)
      .pipe(this.takeUntilDestroy())
      .subscribe(() => {
        this.jobsService.loadScheduleByMonth(new Date());
        this.loading = false;
      });
  }
}
