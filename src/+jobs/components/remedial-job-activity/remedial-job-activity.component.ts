import { Component, Input, OnInit } from '@angular/core';

import { DialogService } from '@shell/dialogs/dialog.service';
import { JobVerificationComponent } from './job-verification/job-verification.component';
import { WindowService } from '@services/window.service';
import { reverse } from 'ramda';

@Component({
  selector: 'ven-remedial-job-activity',
  templateUrl: './remedial-job-activity.component.html',
  styleUrls: ['./remedial-job-activity.component.scss'],
})
export class RemedialJobActivityComponent implements OnInit {
  @Input() specUid;
  @Input() jobUid;
  @Input() subbieUid;
  @Input() job;

  public activity;
  public footerTitle = 'VIEW ACTIVITY';

  constructor(private dialogService: DialogService, private windowService: WindowService) {}

  ngOnInit() {
    //as we need to show the step from down to up, we need a reversed activity array
    this.activity = reverse(this.job.activity);
  }

  verify() {
    this.dialogService.open(JobVerificationComponent, {
      data: {
        specUid: this.specUid,
        jobUid: this.jobUid,
        subbieUid: this.subbieUid,
        job: this.job,
      },
      dialogTitle: 'Verify Remedial Work',
    });
  }

  onViewImages(completeInfo) {
    completeInfo.images.forEach((image) => {
      this.windowService.windowRef.open(image.url, '_blank').focus;
    });
  }

  getCompleteStep(step) {
    return {
      date: step.date,
      message: `Marked completed by ${step.user}`,
      comments: step.comments,
    };
  }

  getCreateStep(step) {
    return {
      date: step.date,
      message: 'Remedial created',
    };
  }

  getVerifiedStep(step) {
    return {
      date: step.date,
      message: `Verified by ${step.staff}`,
      comments: step.feedback, // TODO rename to comments?
    };
  }

  getDeclinedStep(step) {
    return {
      date: step.date,
      message: `Declined by ${step.staff}`,
      comments: step.feedback, // TODO rename to comments?
    };
  }
}
