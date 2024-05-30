import { Component, Input, OnInit } from '@angular/core';
import { JobCompletedInfo, JobCreatedInfo, JobScheduleInfo } from '@interfaces/job-model.interface';

import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-standard-job-activity',
  templateUrl: './standard-job-activity.component.html',
  styleUrls: ['./standard-job-activity.component.scss'],
})
export class StandardJobActivityComponent implements OnInit {
  @Input() activity;
  public footerTitle = 'VIEW ACTIVITY';

  public completed: JobCompletedInfo;
  public created: JobCreatedInfo;
  public scheduled: JobScheduleInfo;

  constructor(private windowService: WindowService) {}

  ngOnInit() {
    this.created = this.activity[0];
    this.scheduled = this.activity[1];
    this.completed = this.activity[2];
  }

  onViewImages() {
    this.completed.images.forEach((image) => {
      this.windowService.windowRef.open(image.url, '_blank').focus;
    });
  }

  getCreateStep(step) {
    return {
      date: step.date,
      message: 'Job created',
    };
  }

  getCompletedStep(step) {
    return {
      date: step.date,
      message: `Marked completed by ${step.user}`,
      comments: step.comments,
    };
  }
}
