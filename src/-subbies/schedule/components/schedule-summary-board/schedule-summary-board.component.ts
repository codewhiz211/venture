import { Component, OnInit } from '@angular/core';

import { JobsService } from '@jobs/services/jobs.service';

@Component({
  selector: 'ven-subbie-schedule-summary-board',
  templateUrl: './schedule-summary-board.component.html',
  styleUrls: ['./schedule-summary-board.component.scss'],
})
export class ScheduleSummaryBoardComponent implements OnInit {
  public scheduledJobs$;
  public activeDate$;
  constructor(private jobsService: JobsService) {}

  ngOnInit(): void {
    this.scheduledJobs$ = this.jobsService.scheduledJobs$;
    this.activeDate$ = this.jobsService.activeDate$;
  }
}
