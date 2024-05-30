import { Component, Input, OnInit } from '@angular/core';

import { JobSummary } from '@interfaces/job-summary.interface';
import { JobsService } from '../../../../../+jobs/services/jobs.service';

@Component({
  selector: 'ven-subbie-schedule-summary-card',
  templateUrl: './schedule-summary-card.component.html',
  styleUrls: ['./schedule-summary-card.component.scss'],
})
export class ScheduleSummaryCardComponent implements OnInit {
  @Input() jobSummary: JobSummary;

  public job;
  public date: number;
  public month: string;
  constructor(private jobsService: JobsService) {}

  ngOnInit(): void {
    this.job = this.jobSummary.job;
    const scheduledInfo = this.jobsService.getActivityInfo(this.job, 'scheduled');
    if (scheduledInfo) {
      const d = new Date(scheduledInfo.dueDate);
      this.date = d.getDate();
      this.month = d.toLocaleDateString('EN', { month: 'short' });
    }
  }

  openDetails() {
    //TODO open job details card
  }
}
