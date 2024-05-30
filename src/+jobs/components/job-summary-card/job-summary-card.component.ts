import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';
import { FormControl, FormGroup } from '@angular/forms';
import { getDisplayStatus, getDuration } from '../../helpers';

import { AuthService } from '@auth/services/auth.service';
import { BaseComponent } from 'src/shared/components/base.component';
import { ConfirmationDialogComponent } from 'src/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Job } from '@interfaces/job-model.interface';
import { JobContent } from '@interfaces/job-content.enum';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScheduleDateFormComponent } from './schedule-date-form/schedule-date-form.component';
import { SubbieJobDetailComponent } from '../subbie-job-detail/subbie-job-detail.component';
import { SubbieJobService } from '@services/spec/subbie-job.service';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-subbie-job-summary-card',
  templateUrl: './job-summary-card.component.html',
  styleUrls: ['./job-summary-card.component.scss'],
})
export class JobSummaryCardComponent extends BaseComponent implements OnInit {
  @Input() job: Job;
  @Input() specUid: string;
  @Input() jobUid: string;
  @Input() subbieUid: string;
  @Input() content: JobContent;
  public isAdmin: boolean = false;

  public title;
  public startDate;
  public dueDate;
  public isMobile: boolean;
  public isRemedial: boolean;
  public activity;
  public status: string;
  public duration;
  // public scheduleFormDate: FormGroup;
  public today = new Date(); //for date picker start point

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    private subbieService: SubbieJobService,
    private snackBar: MatSnackBar,
    private windowService: WindowService,
    private authService: AuthService
  ) {
    super();
    // this.scheduleFormDate = new FormGroup({ start: new FormControl(this.today), end: new FormControl(this.today) });
  }

  ngOnInit(): void {
    this.convertActivityToObj();
    this.calcDisplayValues();
  }

  private calcDisplayValues() {
    this.isMobile = this.windowService.isMobile;
    this.isAdmin = this.content === JobContent.admin;
    this.title = this.isAdmin ? this.job.subbieName : this.job.address;

    if (this.job) {
      this.isRemedial = this.job.type?.includes('remedial');

      //Standard Status:'TBC','SCHEDULED','COMPLETED'
      //Remedial Status: 'TBC', 'READY','COMPLETE - PENDING', 'COMPLETED'
      this.status = getDisplayStatus(this.job.status, this.job.type);

      if (this.isRemedial) {
        //remedial
        if (this.activity.completed?.date) {
          this.duration = getDuration(this.activity.completed.date);
        } else if (this.activity.ready?.date) {
          this.duration = getDuration(this.activity.ready.date);
        }
      } else {
        this.startDate = this.activity.scheduled?.startDate;
        this.dueDate = this.activity.completed?.date || this.activity.scheduled?.dueDate;

        //re-enable after updating ng material
        // if (this.startDate) {
        //   this.scheduleFormDate.patchValue({ start: new Date(this.startDate) });
        // }
        // if (this.dueDate) {
        //   this.scheduleFormDate.patchValue({ end: new Date(this.dueDate) });
        // }
      }
    }
  }

  handleEditJob() {
    this.dialogService.open(SubbieJobDetailComponent, {
      data: {
        uid: this.specUid,
        jobUid: this.jobUid,
        subbieUid: this.subbieUid,
        subbieJob: this.job,
      },
      dialogTitle: 'Edit Job',
    });
  }

  handleDeleteJob() {
    this.dialogService
      .open(ConfirmationDialogComponent, {
        data: {
          html: 'This will permanently delete the job and cannot be undone. Are you sure you want to delete this job?',
        },
        dialogTitle: 'Delete Job',
      })
      .pipe(this.takeUntilDestroy())
      .subscribe((result) => {
        if (result) {
          this.subbieService.deleteJob(this.specUid, this.subbieUid, this.jobUid, this.job).subscribe(() => {
            this.subbieService.getSubbieJobs(this.specUid, true);
            this.snackBar
              .open('Job deleted', 'UNDO', { duration: 5000 })
              .onAction()
              .subscribe(() => {
                this.subbieService.restoreJobs(this.specUid, this.subbieUid, this.jobUid).subscribe((result) => {
                  if (result) {
                    this.subbieService.getSubbieJobs(this.specUid, true);
                  }
                });
              });
          });
        }
      });
  }

  openSchedulingDialog() {
    this.dialogService.open(ScheduleDateFormComponent, {
      data: {
        specUid: this.specUid,
        subbieUid: this.subbieUid,
        jobUid: this.jobUid,
        job: this.job,
        start: this.startDate,
        end: this.dueDate,
      },
      dialogTitle: 'Schedule Job',
    });
  }

  dateSelected(date) {
    const updatedJob = { ...this.job }; //clone job
    const scheduled = {
      step: 'scheduled',
      startDate: this.activity.scheduled.startDate,
      dueDate: Date.parse(date.value),
      date: Date.now(),
      scheduler: this.authService.authUser?.email,
    };

    if (this.activity.scheduled) {
      const scheduledIndex = updatedJob.activity.findIndex((info) => info.step == 'scheduled');
      updatedJob.activity[scheduledIndex] = scheduled;
    } else {
      updatedJob.activity.push(scheduled);
    }
    updatedJob.status = 'scheduled';
    this.subbieService.updateJobWithoutChangingSubbie(updatedJob, this.specUid, this.subbieUid, this.jobUid).subscribe(() => {
      this.subbieService.getSubbieJobs(this.specUid, true);
    });
  }

  convertActivityToObj() {
    this.activity = {};
    //we need get the latest completed record for remedial job
    for (let j = 0; j < this.job.activity.length; j++) {
      const info = this.job.activity[j];
      switch (info.step) {
        case 'created':
          this.activity.created = info;
          break;
        case 'ready':
          this.activity.ready = info;
          break;
        case 'scheduled':
          this.activity.scheduled = info;
          break;
        case 'completed':
          this.activity.completed = info;
          break;
        case 'verified':
          this.activity.verified = info;
      }
    }
  }
}
