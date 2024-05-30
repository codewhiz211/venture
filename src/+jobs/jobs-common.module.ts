import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';

import { CommonModule } from '@angular/common';
import { EmailModule } from '../+email/src/email.module';
import { JobStepContentLabel } from './job-step-label/job-step-label.component';
import { JobSummaryCardComponent } from './components/job-summary-card/job-summary-card.component';
import { JobVerificationComponent } from './components/remedial-job-activity/job-verification/job-verification.component';
import { JobsService } from './services/jobs.service';
import { MatStepperModule } from '@angular/material/stepper';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RemedialJobActivityComponent } from './components/remedial-job-activity/remedial-job-activity.component';
import { ScheduleDateFormComponent } from './components/job-summary-card/schedule-date-form/schedule-date-form.component';
import { SharedModule } from '@shared/shared.module';
import { StandardJobActivityComponent } from './components/standard-job-activity/standard-job-activity.component';
import { SubbieJobBoardComponent } from './components/subbie-job-board/subbie-job-board.component';
import { SubbieJobCardComponent } from './components/subbie-job-card/subbie-job-card.component';
import { SubbieJobDetailComponent } from './components/subbie-job-detail/subbie-job-detail.component';
import { SubbiesBlankMessageComponent } from './components/subbies-blank-message/subbies-blank-message.component';
import { angularMaterialModules } from 'src/app/app.module.imports';

@NgModule({
  declarations: [
    JobSummaryCardComponent,
    SubbieJobDetailComponent,
    ScheduleDateFormComponent,
    SubbieJobBoardComponent,
    SubbieJobCardComponent,
    StandardJobActivityComponent,
    RemedialJobActivityComponent,
    JobVerificationComponent,
    SubbiesBlankMessageComponent,
    JobStepContentLabel,
  ],
  imports: [CommonModule, angularMaterialModules, MatStepperModule, ReactiveFormsModule, EmailModule, SharedModule],
  exports: [JobSummaryCardComponent, SubbieJobBoardComponent],
  providers: [JobsService],
})
export class JobsCommonModule {}
