import { Component, OnInit } from '@angular/core';

import { AppBarMenuService } from '@shell/app-bar-menu.service';
import { AuthService } from '@auth/services/auth.service';
import { BaseComponent } from '../../../../shared/components/base.component';
import { JobSummary } from '@interfaces/job-summary.interface';
import { JobsService } from '@jobs/services/jobs.service';
import { Observable } from 'rxjs';
import { SubbieJobService } from '@services/spec/subbie-job.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ven-subbies-jobs-page',
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.scss'],
})
export class JobsPageComponent extends BaseComponent implements OnInit {
  public outStandingRemedialJobs$: Observable<JobSummary[]>;
  public allJobs$: Observable<JobSummary[]>;
  public loading: boolean = true;

  constructor(
    private jobsService: JobsService,
    private menuService: AppBarMenuService,
    private subbieService: SubbieJobService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    const subbieUid = this.authService.authUser?.subbieUid;

    this.allJobs$ = this.jobsService.jobs$;
    this.outStandingRemedialJobs$ = this.jobsService.jobs$.pipe(
      this.takeUntilDestroy(),
      map((jobs) => this.jobsService.getOutstandingRemedialJobs(jobs))
    );

    this.jobsService
      .loadAllJobsUnderSubbie(subbieUid)
      .pipe(this.takeUntilDestroy())

      .subscribe(() => (this.loading = false));

    // TODO using OLD icons
    // TODO this is a hack, need to work out how to fix the ExpressionChangedAfterItHasBeenCheckedError without this
    // hide this menu item temporarily as the functions haven't done yet.
    // setTimeout(() => {
    //   this.menuService.addMenuItem({
    //     icon: 'tune',
    //     label: 'Job Filter Test',
    //     method: () => alert('Filters'),
    //     order: 0,
    //   });
    //   this.menuService.addMenuItem({
    //     icon: 'search',
    //     label: 'Search',
    //     method: () => alert('Search'),
    //     order: 1,
    //   });
    // }, 0);
  }

  ngOnDestroy(): void {
    this.menuService.removeMenuItem('Job Filter Test');
    this.menuService.removeMenuItem('Search');
  }

  // private divideJobs(jobs) {
  //   if (jobs == undefined) {
  //     return;
  //   }
  //   this.outStandingRemedialJobs = this.jobsService.getOutstandingRemedialJobs(jobs);
  //   // TODO
  //   this.allJobs = jobs;
  //   this.loading = false; // TODO make this more reactive
  // }
}
