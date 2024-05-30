import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BlankScheduleCardComponent } from './schedule/components/schedule-summary-board/blank-schedule-card/blank-schedule-card.component';
import { CardCalendarHeaderComponent } from './schedule/components/customising-header-calendar/card-calendar-header/card-calendar-header.component';
import { CommonModule } from '@angular/common';
import { CustomisingHeaderCalendarComponent } from './schedule/components/customising-header-calendar/customising-header-calendar.component';
import { FilesModule } from 'src/+files/src/files.module';
import { HomePageComponent } from './home/components/home-page/home-page.component';
import { IconsPageComponent } from '../app/icons.page.component';
import { JobDetailTabContentComponent } from './jobs/components/job-details/job-detail-tab-content/job-detail-tab-content.component';
import { JobDetailsPageComponent } from './jobs/components/job-details/job-details.component';
import { JobsBoardComponent } from './jobs/components/jobs-board/jobs-board.component';
import { JobsCommonModule } from '@jobs/jobs-common.module';
import { JobsPageComponent } from './jobs/components/jobs-page/jobs-page.component';
import { JobsService } from '@jobs/services/jobs.service';
import { MarkCompleteContentComponent } from './jobs/components/job-details/mark-complete-content/mark-complete-content.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { NoSavedJobsCardComponent } from './home/components/no-saved-jobs-card/no-saved-jobs-card.component';
import { PreferenceService } from '@services/preference.service';
import { PrintModule } from '@print/print.module';
import { ProjectManagerFieldsComponent } from './jobs/components/job-details/project-manager-fields/project-manager-fields.component';
import { SchedulePageComponent } from './schedule/components/schedule-page/schedule-page.component';
import { ScheduleSummaryBoardComponent } from './schedule/components/schedule-summary-board/schedule-summary-board.component';
import { ScheduleSummaryCardComponent } from './schedule/components/schedule-summary-board/schedule-summary-card/schedule-summary-card.component';
import { SharedModule } from '../shared/shared.module';
import { ShellModule } from '@shell/shell.module';
import { SpecControlsModule } from '../spec-controls/spec-controls.module';
import { SpecModule } from 'src/-venture/+spec/spec.module';
import { SubbiesRouting } from './subbies.routing';
import { ViewSpecComponent } from './jobs/components/job-details/view-spec/view-spec.component';

@NgModule({
  declarations: [
    HomePageComponent,
    JobsPageComponent,
    JobsBoardComponent,
    JobDetailsPageComponent,
    SchedulePageComponent,
    CardCalendarHeaderComponent,
    CustomisingHeaderCalendarComponent,
    ScheduleSummaryBoardComponent,
    ScheduleSummaryCardComponent,
    BlankScheduleCardComponent,
    IconsPageComponent,
    ViewSpecComponent,
    NoSavedJobsCardComponent,
    JobDetailTabContentComponent,
    ProjectManagerFieldsComponent,
    MarkCompleteContentComponent,
  ],
  imports: [
    CommonModule,
    JobsCommonModule,
    SubbiesRouting,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    ShellModule,
    SharedModule,
    SpecModule,
    FilesModule,
    PrintModule,
    SpecControlsModule,
  ],
  providers: [JobsService, PreferenceService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  entryComponents: [ProjectManagerFieldsComponent, MarkCompleteContentComponent],
})
export class SubbiesModule {}
