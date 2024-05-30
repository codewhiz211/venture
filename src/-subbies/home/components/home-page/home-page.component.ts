import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';

import { AuthService } from '@auth/services/auth.service';
import { BaseComponent } from '../../../../shared/components/base.component';
import { JobSummary } from '@interfaces/job-summary.interface';
import { JobsService } from '@jobs/services/jobs.service';
import { PreferenceService } from '@services/preference.service';
import { WindowService } from '@services/window.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ven-subbies-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent extends BaseComponent implements OnInit {
  public outStandingRemedialJobs$: Observable<JobSummary[]>;
  public savedJobs$: Observable<JobSummary[]>;

  public loading: boolean = true;
  public loaderOffset: number;

  public noSavedPassages = [
    'Save any job to the homepage for quick and easy access.',
    'Simply tap the star on any job and it will be displayed here.',
  ];

  constructor(
    private jobsService: JobsService,
    private authService: AuthService,
    private windowService: WindowService,
    private preference: PreferenceService
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.windowService.isDesktop) {
      this.loaderOffset = -100; //center loader on mobile, due to logo shown in mobile view
    }

    this.outStandingRemedialJobs$ = this.jobsService.jobs$.pipe(
      this.takeUntilDestroy(),
      map((jobs) => this.jobsService.getOutstandingRemedialJobs(jobs))
    );
    this.savedJobs$ = combineLatest([this.jobsService.jobs$, this.preference.savedJobs$]).pipe(
      this.takeUntilDestroy(),
      map(([jobs, savedJobs]) => {
        return jobs.filter((job) => savedJobs[job.jobUid]);
      })
    );

    const subbieUid = this.authService.authUser?.subbieUid;
    this.jobsService
      .loadAllJobsUnderSubbie(subbieUid)
      .pipe(this.takeUntilDestroy())
      .subscribe(() => (this.loading = false));
  }

  // private divideJobs(jobs) {
  //   if (jobs == undefined) {
  //     return;
  //   }
  //   this.savedJobs = [];
  //   jobs.forEach((jobItem) => {
  //     const job = jobItem.job;
  //     if (job.saved?.[this.userUid]) {
  //       this.savedJobs.push(jobItem);
  //     }
  //   });
  //   this.loading = false;
  // }
}
