import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@auth/services/auth.service';
import { BaseComponent } from 'src/shared/components/base.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '@shell/drawer/drawer.service';
import { EmailService } from '@services/email.service';
import { IDrawerContentComponent } from '@shell/drawer/drawer-content.interfaces';
import { MASTER_EMAIL } from '@shared/config/constants';
import { Observable } from 'rxjs';
import { SnackBarService } from '@services/snackbar.service';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SubbieJobService } from '@services/spec/subbie-job.service';
import { WindowService } from '@services/window.service';
import { jobsCommonLogger } from '../../job.logger';
import { omit } from 'ramda';

@Component({
  selector: 'ven-subbie-job-detail',
  templateUrl: './subbie-job-detail.component.html',
  styleUrls: ['./subbie-job-detail.component.scss'],
})
export class SubbieJobDetailComponent extends BaseComponent implements IDrawerContentComponent, OnInit {
  @Input() data: any;

  public isEdit = false;
  public jobUid = undefined;
  public loading: boolean = false;
  public subbieJobForm: FormGroup;
  public subbieList$: Observable<any[]>;
  private specUid: string;
  public subbieUid: string;
  public showUrgent: boolean = false;
  public showEmailForm: boolean;
  public emailData: any;

  public submitAction = {
    label: 'SAVE',
    handler: () => this.onSaveClick(null),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };

  private currentSpec;

  constructor(
    private subbieService: SubbieJobService,
    private drawerService: DrawerService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackBarService,
    private activeSpec: SpecActiveService,
    private dialogService: DialogService,
    private emailService: EmailService,
    private windowService: WindowService
  ) {
    super();
    this.subbieJobForm = this.formBuilder.group({
      type: ['', Validators.compose([Validators.required])],
      description: [''],
      subbie: [''],
      message: [{ value: false, disabled: true }],
      isUrgent: [false],
    });
  }

  ngOnInit(): void {
    this.currentSpec = this.activeSpec.getActiveSpec();
    this.specUid = this.data.uid;
    this.subbieUid = this.data.subbieUid;
    if (this.data.subbieJob) {
      this.isEdit = true;
      this.jobUid = this.data.jobUid;
      this.showUrgent = this.data.subbieJob.type == 'remedial';
      this.subbieJobForm.setValue(this.getJobDetail(this.data.subbieJob));
      this.handleMessageControl();
    }

    this.initSubbieList();
    this.watchValueChanges();
  }

  private initSubbieList() {
    this.subbieList$ = this.subbieService.getSubbieList().pipe(this.takeUntilDestroy());
    this.subbieList$.subscribe((subbieList) => {
      //avoid sending email to users under deleted subbie
      if (subbieList[this.subbieUid] == undefined) {
        this.subbieJobForm.value.subbie = undefined;
        this.handleMessageControl();
      }
    });
  }

  private handleMessageControl() {
    const formValues = this.subbieJobForm.getRawValue();
    if (formValues.type && formValues.subbie) {
      this.subbieJobForm.get('message').enable();
    } else {
      this.subbieJobForm.get('message').disable();
    }
  }

  private watchValueChanges() {
    //Type Changes
    this.subbieJobForm
      .get('type')
      .valueChanges.pipe(this.takeUntilDestroy())
      .subscribe((value) => {
        if (this.subbieJobForm.get('type').disabled) {
          return;
        }
        const defaultDescription = {
          'standard-electrical': 'Standard Electrical install as per plans',
          'standard-plumbing': 'Standard Plumbing fit out as per plans',
          remedial: '',
          standard: '',
        };
        this.subbieJobForm.patchValue({ description: defaultDescription[value] });
        this.showUrgent = value == 'remedial';
        //As the subbieJobForm updated after subscribe, so we need to pass the value here
        this.handleMessageControl();
      });

    //Subbie Changes
    this.subbieJobForm
      .get('subbie')
      .valueChanges.pipe(this.takeUntilDestroy())
      .subscribe((value) => {
        if (this.subbieJobForm.get('subbie').disabled) {
          return;
        }
        this.handleMessageControl();
      });

    //Notification Checkbox Changes
    this.subbieJobForm
      .get('message')
      .valueChanges.pipe(this.takeUntilDestroy())
      .subscribe((value) => {
        if (value == true) {
          this.subbieService
            .getAllEmailsUnderSubbie(this.subbieJobForm.value.subbie)
            .pipe(this.takeUntilDestroy())
            .subscribe((emails: string[]) => {
              const emailTo = emails;

              this.emailData = {
                to: '',
                from: this.authService.authUser?.email,
                message: '',
                subject: '',
                templateId: '',
                link: `${this.windowService.windowRef.location.protocol}//${this.windowService.windowRef.location.host}`,
              };

              if (this.subbieJobForm.value.isUrgent == true) {
                this.emailData.subject = 'URGENT: ';
              }
              if (this.subbieJobForm.value.type.includes('standard')) {
                this.emailData.subject += this.isEdit ? 'Job updated' : 'New Venture Job';
                this.emailData.emailType = this.isEdit ? 'JOB_UPDATED' : 'JOB_CREATED';
              } else if (this.subbieJobForm.value.type.includes('remedial')) {
                this.emailData.subject += 'Remedial Work Required';
                this.emailData.emailType = 'REMEDIAL_CREATED';
                emailTo.push(MASTER_EMAIL);
              } else {
                return;
              }

              const projectManagerEmail = this.currentSpec.contact_details.projectManagerEmail;
              emailTo.push(projectManagerEmail);

              this.emailData.to = emailTo.toString();

              this.emailData.message = this.isEdit
                ? `Hi there,\n A job has been updated. Please log in to the Venture app to see the latest details.`
                : `Hi there,\n A new job has been assigned. Please log in to the Venture app to see the latest details.`;

              this.showEmailForm = true;
              if (this.subbieJobForm.get('type').enabled) {
                this.subbieJobForm.get('type').disable();
                this.subbieJobForm.get('description').disable();
                this.subbieJobForm.get('subbie').disable();
                this.subbieJobForm.get('isUrgent').disable();
              }
            });
        } else {
          this.showEmailForm = false;
          //As the enable() and disable() will trigger data change subscription,
          //we cut the loop of dataChanging subscription.
          if (this.subbieJobForm.get('type').disabled) {
            const description = this.subbieJobForm.getRawValue().description;
            this.subbieJobForm.get('type').enable();
            this.subbieJobForm.get('description').enable();
            this.subbieJobForm.get('subbie').enable();
            this.subbieJobForm.get('isUrgent').enable();
            this.subbieJobForm.patchValue({ description }); // fix the issue that the description field is cleared when being re-enabled
          }
        }
      });
  }

  private getJobDetail(job) {
    return {
      type: job.type,
      description: job.description,
      subbie: this.subbieUid,
      isUrgent: job.isUrgent,
      message: false,
    };
  }

  onSaveClick(email) {
    this.loading = true;
    const subbieUid = this.subbieJobForm.getRawValue().subbie;
    const subbieName = this.subbieService.getSubbieName(subbieUid);
    if (this.isEdit) {
      const newSubbieInfo = {
        ...this.data.subbieJob,
        ...omit(['message', 'subbie'], this.subbieJobForm.getRawValue()),
        subbieName,
      };
      this.subbieService
        .updateJob(newSubbieInfo, this.specUid, subbieUid, this.jobUid, this.subbieUid)
        .pipe(this.takeUntilDestroy())
        .subscribe(() => {
          this.afterUploadingJob(email);
        }, this.handleError);
    } else {
      this.subbieService
        .addSubbieJob(
          {
            ...omit(['message', 'subbie'], this.subbieJobForm.getRawValue()),
            ...{ address: this.currentSpec.section_details.address || '', subbieName },
          },
          this.specUid,
          subbieUid
        )
        .pipe(this.takeUntilDestroy())
        .subscribe(() => {
          this.afterUploadingJob(email);
        }, this.handleError);
    }
  }

  handleError(err) {
    this.loading = false;
    jobsCommonLogger.console.error(err);
  }

  private afterUploadingJob(emailData) {
    if (emailData) {
      let emailMethod;
      switch (emailData.emailType) {
        case 'JOB_CREATED':
          emailMethod = this.emailService.sendJobCreatedEmail(omit(['emailType'], emailData));
          break;

        case 'JOB_UPDATED':
          emailMethod = this.emailService.sendJobUpdatedEmail(omit(['emailType'], emailData));
          break;

        case 'REMEDIAL_CREATED':
          emailMethod = this.emailService.sendRemedialCreatedEmail(omit(['emailType'], emailData));
          break;

        default:
          alert('Unknown Email type');
      }
      emailMethod.subscribe(
        () => {
          this.snackbarService.open(`Notification emailed to ${emailData.to}`, undefined, {
            duration: 2000,
          });
        },
        (error) => {
          console.error(error);
          this.snackbarService.open(`Notification by email FAILED`);
        }
      );
    }
    this.subbieService.getSubbieJobs(this.specUid, true);
    this.loading = false;
    this.onCancelClick();
  }

  onCancelClick() {
    this.subbieJobForm.reset();
    this.dialogService.closeActiveDialog();
    this.drawerService.close(); //leave for old shell
  }
}
