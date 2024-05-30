import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { AuthService } from '@auth/services/auth.service';
import { BaseComponent } from '@shared/components/base.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { EmailService } from '@services/email.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SubbieJobService } from '@services/spec/subbie-job.service';
import { WindowService } from '@services/window.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ven-job-verification',
  templateUrl: './job-verification.component.html',
  styleUrls: ['./job-verification.component.scss'],
})
export class JobVerificationComponent extends BaseComponent {
  @Input() data: any;

  public verifyGroup: FormGroup;

  public submitAction = {
    label: 'VERIFY',
    handler: () => this.onVerify(),
  };

  public closeAction = {
    label: 'DECLINE',
    handler: () => this.onDecline(),
  };

  constructor(
    private authService: AuthService,
    private subbieJobService: SubbieJobService,
    private dialogService: DialogService,
    private emailService: EmailService,
    private activeSpecService: SpecActiveService,
    private windowService: WindowService,
    private snackBar: MatSnackBar
  ) {
    super();
    this.verifyGroup = new FormGroup({ feedback: new FormControl('') });
  }

  onDecline() {
    this.saveJob('ready', 'declined');
  }

  onVerify() {
    this.saveJob('verified', 'verified');
  }

  saveJob(status, step) {
    const verifyInfo = {
      step,
      feedback: this.verifyGroup.value.feedback,
      date: Date.now(),
      staff: this.authService.authUser.name,
    };
    const updatedJob = { ...this.data.job };
    updatedJob.activity.push(verifyInfo);
    updatedJob.status = status;
    this.subbieJobService
      .updateJobWithoutChangingSubbie(updatedJob, this.data.specUid, this.data.subbieUid, this.data.jobUid)
      .pipe(
        switchMap(() => {
          this.subbieJobService.getSubbieJobs(this.data.specUid, true);
          return this.subbieJobService.getAllEmailsUnderSubbie(this.data.subbieUid);
        }),
        switchMap((emailAddresses) => {
          const emailData = this.getEmailData(emailAddresses, step);
          return this.emailService.sendRemedialUpdatedEmail(emailData);
        }),
        this.takeUntilDestroy()
      )
      .subscribe(() => {
        this.snackBar.open('Notification sent to subbie.', undefined, { duration: 5000 });
        this.dialogService.closeActiveDialog();
      });
  }

  private getEmailData(emails, step) {
    const spec = this.activeSpecService.getActiveSpec();
    const defaultEmail = 'nicole.holmes@venturedevelopments.co.nz';
    const cc = spec.contact_details.projectManagerEmail ? `${spec.contact_details.projectManagerEmail}, ${defaultEmail}` : defaultEmail;
    return {
      to: emails.toString(),
      cc,
      from: this.authService.authUser?.email,
      status: step == 'verified' ? 'approved' : ('declined' as 'approved' | 'declined'),
      lotNumber: spec.section_details.lot,
      subdivision: spec.section_details.subdivision,
      description: this.data.job.description,
      feedback: this.verifyGroup.value.feedback,
      specId: this.data.specUid,
      link: `${this.windowService.windowRef.location.protocol}//${this.windowService.windowRef.location.host}`,
    };
  }
}
