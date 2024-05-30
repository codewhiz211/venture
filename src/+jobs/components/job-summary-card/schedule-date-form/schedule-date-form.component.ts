import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../../-auth';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '../../../../shell/drawer/drawer.service';
import { SubbieJobService } from '../../../../shared/services';

@Component({
  selector: 'ven-schedule-date-form',
  templateUrl: './schedule-date-form.component.html',
  styleUrls: ['./schedule-date-form.component.scss'],
})
export class ScheduleDateFormComponent implements OnInit {
  @Input() data;

  public today = new Date(); //for start date picker
  public minSelectable; //for end date picker
  public maxSelectable; //for start date picker
  public scheduleDateForm: FormGroup;

  public submitAction = {
    label: 'SAVE',
    handler: () => this.onSaveClick(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };

  constructor(
    private drawerService: DrawerService,
    private dialogService: DialogService,
    private authService: AuthService,
    private subbieService: SubbieJobService
  ) {
    this.scheduleDateForm = new FormGroup({
      start: new FormControl('', Validators.compose([Validators.required])),
      end: new FormControl('', Validators.compose([Validators.required])),
    });
    this.minSelectable = this.today;
  }

  ngOnInit(): void {
    if (this.data.start) {
      const startDate = new Date(this.data.start);
      this.scheduleDateForm.patchValue({ start: startDate });
      this.minSelectable = startDate;
    }
    if (this.data.end) {
      const endDate = new Date(this.data.end);
      this.scheduleDateForm.patchValue({ end: endDate });
      this.maxSelectable = endDate;
    }
    if (!this.scheduleDateForm.controls['start'].valid) {
      this.scheduleDateForm.controls['end'].disable();
    }
  }

  onCancelClick() {
    this.scheduleDateForm.reset();
    this.drawerService.close(); // leave for old shell
    this.dialogService.closeActiveDialog();
  }

  onSaveClick() {
    const scheduled = {
      step: 'scheduled',
      startDate: Date.parse(this.scheduleDateForm.value.start),
      dueDate: Date.parse(this.scheduleDateForm.value.end),
      date: Date.now(),
      scheduler: this.authService.authUser?.email,
    };
    const updatedJob = { ...this.data.job };
    const scheduledIndex = updatedJob.activity.findIndex((activity) => activity.step == 'scheduled');
    if (scheduledIndex != -1) {
      updatedJob.activity[scheduledIndex] = scheduled;
    } else {
      updatedJob.activity.push(scheduled);
    }
    updatedJob.status = 'scheduled';
    this.subbieService
      .updateJobWithoutChangingSubbie(updatedJob, this.data.specUid, this.data.subbieUid, this.data.jobUid)
      .subscribe(() => {
        this.subbieService.getSubbieJobs(this.data.specUid, true);
        this.onCancelClick();
      });
  }

  startDaySelected($event) {
    this.minSelectable = $event.value;
    if (this.scheduleDateForm.controls['start'].valid) {
      this.scheduleDateForm.controls['end'].enable();
    }
  }

  endDaySelected($event) {
    this.maxSelectable = $event.value;
  }
}
