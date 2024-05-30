import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '@shared/components/base.component';
import { SubbieJobService } from '@services/spec/subbie-job.service';
import { jobLogger } from 'src/-subbies/jobs/jobs.logger';

@Component({
  selector: 'ven-subbie-job-board',
  templateUrl: './subbie-job-board.component.html',
  styleUrls: ['./subbie-job-board.component.scss'],
})
export class SubbieJobBoardComponent extends BaseComponent implements OnInit {
  @Input() specUid;

  public standardJobs = [];
  public remedialJobs = [];

  constructor(public subbieService: SubbieJobService) {
    super();
  }

  ngOnInit(): void {
    this.subbieService.getSubbieJobs(this.specUid);

    this.subbieService.subbieJobs$.pipe(this.takeUntilDestroy()).subscribe((jobs) => {
      this.standardJobs = [];
      this.remedialJobs = [];
      if (!jobs) {
        return;
      }
      this.divideJobs(jobs);
    });
    //load subbies for subbie job detail drawer;
    this.subbieService.loadSubbies();
  }

  ngOnChanges(changes) {
    //get subbie jobs
    if (changes.specUid.currentValue) {
      this.subbieService.getSubbieJobs(this.specUid);
    }
  }

  private divideJobs(jobs) {
    this.standardJobs = [];
    this.remedialJobs = [];
    Object.keys(jobs).forEach((subbieUid) => {
      const jobsUnderSubbie = jobs[subbieUid];
      Object.keys(jobsUnderSubbie).forEach((key) => {
        const job = jobsUnderSubbie[key];
        if (!job || !job.type) {
          jobLogger(`Job ${subbieUid}/${key} doesn't have enough information.`);
          return;
        }
        if (job.type.includes('standard')) {
          this.standardJobs.push({ job, key: key, subbieUid: subbieUid });
        } else if (job.type.includes('remedial')) {
          this.remedialJobs.push({ job, key: key, subbieUid: subbieUid });
        }
      });
    });
  }
}
