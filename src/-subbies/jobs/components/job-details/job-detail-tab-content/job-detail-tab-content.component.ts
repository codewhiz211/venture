import { Component, Input, OnInit } from '@angular/core';
import { RemedialJobStatus, StandardJobStatus } from '@interfaces/job-model.interface';

export interface JobDetailInfo {
  subdivision: string;
  lotNumber: string;
  projectManager: string;
  scheduleDate?: string;
  description?: string;
}

@Component({
  selector: 'ven-subbie-job-detail-tab-content',
  templateUrl: './job-detail-tab-content.component.html',
  styleUrls: ['./job-detail-tab-content.component.scss'],
})
export class JobDetailTabContentComponent implements OnInit {
  @Input() data;

  public progress: number;
  public progressLabels: string[];
  public jobDetails: JobDetailInfo;
  public infoKeys: string[];
  public projectManager;

  // jobDetailInfo keys and field displaying name
  public fieldDisplayNames = {
    subdivision: 'subdivision',
    lotNumber: 'lot#',
    projectManager: 'project manager',
    scheduleDate: 'schedule date',
    description: 'job description',
  };

  constructor() {}

  ngOnInit() {
    const jobStatus = this.data.jobStatus;
    const jobType = this.data.jobType;
    this.jobDetails = this.data.jobDetails;
    this.projectManager = this.data.projectManager;
    this.getProgress(jobStatus, jobType);
    this.infoKeys = Object.keys(this.jobDetails);
  }

  private getProgress(status, type) {
    if (!status || !type) {
      return;
    }
    this.progressLabels = type == 'remedial' ? RemedialJobStatus : StandardJobStatus;
    const statusValue = {
      created: 1,
      ready: 2,
      scheduled: 2,
      completed: 3,
      verified: 4,
    };
    this.progress = statusValue[status];
  }
}
