import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AppChromeDetailsPageFooterConfig } from '@shell/app-chrome-details-page-footer/app-chrome-details-page-footer.component';
import { BaseComponent } from '@shared/components/base.component';
import COLOURS from '@styles/colours';
import { DialogService } from '@shell/dialogs/dialog.service';
import { JobDetailTabContentComponent } from './job-detail-tab-content/job-detail-tab-content.component';
import { JobsService } from '@jobs/services/jobs.service';
import { MarkCompleteContentComponent } from './mark-complete-content/mark-complete-content.component';
import { PreferenceService } from '@services/preference.service';
import { ProjectManagerFieldsComponent } from './project-manager-fields/project-manager-fields.component';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecService } from '@services/spec/spec.service';
import { SpecTabContentComponent } from '../../../../spec-controls/components/spec-tab-content/spec-tab-content.component';
import { WindowService } from '@services/window.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'ven-subbie-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsPageComponent extends BaseComponent implements OnInit {
  public headerConfig = null;
  public footerConfig: AppChromeDetailsPageFooterConfig = null;
  public contentConfig = null;
  public projectManager = null;
  public jobDetails = null;

  public isDesktop = this.windowService.isDesktop;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobsService,
    private specActiveService: SpecActiveService,
    private specService: SpecService,
    private windowService: WindowService,
    private dialogService: DialogService,
    private preference: PreferenceService
  ) {
    super();
  }

  // TODO type
  public job: any;
  public spec: any;

  ngOnInit(): void {
    const specUid = this.route.snapshot.paramMap.get('specUid');
    const subbieUid = this.route.snapshot.paramMap.get('subbieUid');
    const jobUid = this.route.snapshot.paramMap.get('jobUid');

    combineLatest([this.jobService.getJob(specUid, subbieUid, jobUid), this.specActiveService.activeSpec$])
      .pipe(this.takeUntilDestroy())
      .subscribe(([job, spec]) => {
        if (!job || !spec || specUid != spec.uid) {
          return;
        }
        //The detail tabs will be broken for secondly loading data of job and spec as build-details does.
        if (this.job && this.spec) {
          return;
        }
        this.job = job;
        this.spec = spec;

        this.initJobDetails(job, spec);
        this.initProjectManager(spec);
        this.initHeaderConfig(jobUid);
        this.initContentConfig(spec);
        this.initFooterConfig(specUid, subbieUid, jobUid);
      });

    this.specService.getClientSpecAndSuggestions(specUid);
  }

  private openContactDetails() {
    this.dialogService.open(ProjectManagerFieldsComponent, {
      data: this.projectManager,
      dataKey: 'projectManager',
      dialogTitle: 'Project Manager',
      closeButton: true,
    });
  }

  private openCompleteSection(specUid, subbieUid, jobUid) {
    this.dialogService.open(MarkCompleteContentComponent, {
      dialogTitle: 'Mark As Complete',
      data: { specUid, subbieUid, jobUid, job: this.job, projectManagerEmail: this.projectManager.email, jobDetails: this.jobDetails },
    });
  }

  private initProjectManager(spec) {
    this.projectManager = {
      name: spec?.contact_details?.projectManagerName,
      phone: spec?.contact_details?.projectManagerPhone,
      email: spec?.contact_details?.projectManagerEmail,
    };
  }

  private initJobDetails(job, spec) {
    this.jobDetails = {
      subdivision: spec?.section_details?.subdivision || 'N/A',
      lotNumber: spec?.section_details?.lot || 'N/A',
      projectManager: spec?.contact_details?.projectManagerName || 'N/A',
    };
    if (job.type?.includes('standard')) {
      const scheduleInfo = job?.activity?.find((activity) => activity.step == 'scheduled');
      const startDate = scheduleInfo?.startDate ? new Date(scheduleInfo.startDate).toLocaleDateString() : 'TBC';
      const endDate = scheduleInfo?.dueDate ? new Date(scheduleInfo.dueDate).toLocaleDateString() : 'TBC';
      this.jobDetails.scheduleDate = `${startDate} - ${endDate}`;
    }
    this.jobDetails.description = job?.description || 'N/A';
  }

  private initHeaderConfig(jobUid) {
    const savedColour = this.isDesktop ? COLOURS.white : COLOURS.bluePrimary;
    const nonSavedColour = this.isDesktop ? COLOURS.white : 'gray';
    const isJobSaved = this.preference.savedJobs?.[jobUid] || false;
    this.headerConfig = {
      title: this.job.address,
      barActions: [
        {
          icon: 'star',
          label: 'Favourite',
          action: () => this.preference.handleSavedItemToggle('jobs', jobUid, !isJobSaved),
          colours: { true: savedColour, false: nonSavedColour },
          filled: isJobSaved,
        },
      ],
      menuActions: [],
    };
  }

  private initContentConfig(spec) {
    this.contentConfig = [
      {
        label: 'JOB DETAILS',
        id: 'job',
        component: JobDetailTabContentComponent,
        data: {
          jobStatus: this.job.status,
          jobType: this.job.type == 'remedial' ? 'remedial' : 'standard',
          jobDetails: this.jobDetails,
          projectManager: this.projectManager,
        },
      },
      { label: 'SPEC', id: 'spec', component: SpecTabContentComponent, data: { spec } },
    ];
  }

  private initFooterConfig(specUid, subbieUid, jobUid) {
    this.footerConfig = {
      type: 'forceFab',
      actions: [
        {
          icon: 'contact_phone',
          label: () => 'Contact PM',
          action: () => this.openContactDetails(),
          tabs: ['job'],
        },
        {
          icon: 'check_circle',
          label: () => 'Mark As Complete',
          primary: true,
          hide: this.job.status != 'ready' && this.job.status != 'scheduled',
          shownOnDesktop: true,
          action: () => this.openCompleteSection(specUid, subbieUid, jobUid),
          tabs: ['job'],
        },
      ],
    };
  }
}
