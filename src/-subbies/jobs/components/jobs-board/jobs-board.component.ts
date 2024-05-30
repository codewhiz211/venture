import { Component, Input, OnInit } from '@angular/core';

import { JobContent } from '@interfaces/job-content.enum';
import { JobSummary } from '@interfaces/job-summary.interface';
import { PreferenceService } from '@services/preference.service';

@Component({
  selector: 'ven-subbie-jobs-board',
  templateUrl: './jobs-board.component.html',
  styleUrls: ['./jobs-board.component.scss'],
})
export class JobsBoardComponent implements OnInit {
  @Input() title;
  @Input() titleIcon;
  @Input() jobs: JobSummary[];

  public savedJobRecords$;

  constructor(private preference: PreferenceService) {}

  ngOnInit() {
    this.savedJobRecords$ = this.preference.savedJobs$;
  }

  public content = JobContent.job;

  public handleSavedToggled(jobUid: string, saved: boolean) {
    this.preference.handleSavedItemToggle('jobs', jobUid, saved);
  }
}
