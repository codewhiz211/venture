import { Component, Input } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';
import { BaseComponent } from '@shared/components/base.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { EmailService } from '../../../../../shared/services/email.service';
import { FolderService } from '../../../../../+files/src/services/folder.service';
import { JobsService } from '../../../../../+jobs/services/jobs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SubbieJobService } from '@services/spec/subbie-job.service';
import { WindowService } from '../../../../../shared/services/window.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ven-mark-complete-content',
  templateUrl: './mark-complete-content.component.html',
  styleUrls: ['./mark-complete-content.component.scss'],
})
export class MarkCompleteContentComponent extends BaseComponent {
  @Input() data;

  public uploadedFiles = [];
  public uploading = false; //to disabled COMPLETE button when file uploading
  public comments;
  public folder = 'Subbie uploads';

  constructor(
    private dialogService: DialogService,
    private subbieJobService: SubbieJobService,
    private jobsService: JobsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private folderService: FolderService,
    private emailService: EmailService,
    private windowService: WindowService
  ) {
    super();
  }

  public submitAction = {
    label: 'COMPLETE',
    icon: 'task_alt',
    handler: () => this.onSubmit(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onClose(),
  };
  public onClose() {
    this.dialogService.closeActiveDialog();
  }

  public onSubmit() {
    if (this.uploading) {
      return;
    }
    const completed = {
      step: 'completed',
      comments: this.comments,
      date: Date.now(),
      images: this.uploadedFiles,
      subbie: this.data.subbieUid,
      user: this.authService.authUser?.name,
    };
    const updatedJob = { ...this.data.job, activity: [...this.data.job.activity, completed], status: 'completed' };

    this.subbieJobService
      .updateJobWithoutChangingSubbie(updatedJob, this.data.specUid, this.data.subbieUid, this.data.jobUid)
      .pipe(
        switchMap(() => {
          this.snackBar.open('Job marked as completed', undefined, { duration: 5000 });
          this.router.navigate(['subbies/jobs']);
          return this.jobsService.getSubbieName(this.data.subbieUid);
        }),
        switchMap((subbieName) => {
          //send email to PM
          if (this.data.job.type == 'remedial') {
            return this.emailService.sendRemedialSubmittedEmail(this.getEmailData(subbieName));
          } else {
            this.dialogService.closeActiveDialog();
            return of();
          }
        }),
        this.takeUntilDestroy()
      )
      .subscribe(() => {
        if (this.data.job.type == 'remedial') {
          this.snackBar.open('Notification sent to PM.', undefined, { duration: 5000 });
        }
        this.dialogService.closeActiveDialog();
      });
  }

  public handleUploaded(res) {
    this.uploadedFiles = [...this.uploadedFiles, ...res];
    // create folder for images and the files in folder can't be deleted
    this.folderService.addFolder(this.data.specUid, this.folder);
    this.uploading = false;
  }

  public handleUploading(uploading) {
    this.uploading = uploading;
  }

  private getEmailData(subbieName) {
    const defaultEmail = 'nicole.holmes@venturedevelopments.co.nz';
    const to = this.data.projectManagerEmail ? `${this.data.projectManagerEmail}, ${defaultEmail}` : defaultEmail;
    return {
      to,
      from: this.authService.authUser?.email,
      specId: this.data.specUid,
      lotNumber: this.data.jobDetails.lotNumber,
      subdivision: this.data.jobDetails.subdivision,
      description: this.data.jobDetails.description,
      subbieName: subbieName,
      comments: this.comments,
      link: `${this.windowService.windowRef.location.protocol}//${this.windowService.windowRef.location.host}`,
    };
  }
}
