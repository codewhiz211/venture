import { AdminPageComponent } from './admin-page/admin-page.component';
import { BuildDetailsComponent } from './build-details/build-details.component';
import { BuildManagementTabComponent } from './admin-page/build-management-tab/build-management-tab.component';
import { BuildSummaryCardComponent } from './builds/build-summary-card/build-summary-card.component';
import { BuildsPageComponent } from './builds/builds-page/builds-page.component';
import { CRMPageComponent } from './CRM/crm-page/crm-page.component';
import { CommonModule } from '@angular/common';
import { CopyPricingComponent } from './pricing-details/copy-pricing/copy-pricing.component';
import { DevTabComponent } from './admin-page/dev-tab/dev-tab.component';
import { EditAdminMarginComponent } from './pricing-details/pricing-detail-tab/pricing-accordion/pricing-table/edit-admin-margin/edit-admin-margin.component';
import { ExtraTabContentComponent } from './build-details/extra-tab-content/extra-tab-content.component';
import { FilesModule } from 'src/+files/src/files.module';
import { HomeComponent } from './home/home.component';
import { JobsCommonModule } from '@jobs/jobs-common.module';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { NoteComponent } from './note-library/note/note.component';
import { NoteLibraryComponent } from './note-library/note-library.component';
import { NoteTableComponent } from './note-library/note-table/note-table.component';
import { PngDetailsComponent } from './pricing-details/pricing-detail-tab/pricing-accordion/pricing-table/png-details/png-details.component';
import { PricingAccordionComponent } from './pricing-details/pricing-detail-tab/pricing-accordion/pricing-accordion.component';
import { PricingDetailTabComponent } from './pricing-details/pricing-detail-tab/pricing-detail-tab.component';
import { PricingDetailsComponent } from './pricing-details/pricing-details.component';
import { PricingNoteChoosingComponent } from './pricing-details/pricing-detail-tab/pricing-accordion/pricing-note-choosing/pricing-note-choosing.component';
import { PricingPageComponent } from './pricing/pricing-page/pricing-page.component';
import { PricingRowsComponent } from './pricing-details/pricing-detail-tab/pricing-accordion/pricing-table/pricing-rows/pricing-rows.component';
import { PricingStatusComponent } from './pricing-details/pricing-detail-tab/pricing-status/pricing-status.component';
import { PricingSummaryBoardComponent } from './pricing-details/pricing-summary-board/pricing-summary-board.component';
import { PricingTableComponent } from './pricing-details/pricing-detail-tab/pricing-accordion/pricing-table/pricing-table.component';
import { PricingTotalRowsComponent } from './pricing-details/pricing-detail-tab/pricing-accordion/pricing-table/pricing-total-rows/pricing-total-rows.component';
import { QuoteTabContentComponent } from './build-details/quote-tab-content/quote-tab-content.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportingPageComponent } from './reporting/reporting-page/reporting-page.component';
import { SchedulePageComponent } from './schedule/schedule-page/schedule-page.component';
import { SharedModule } from '@shared/shared.module';
import { ShellModule } from '@shell/shell.module';
import { SpecControlsModule } from '../spec-controls/spec-controls.module';
import { StaffManagementTabComponent } from './admin-page/staff-management-tab/staff-management-tab.component';
import { SubbiesManagementTabComponent } from './admin-page/subbies-management-tab/subbies-management-tab.component';
import { SubmitPricingComponent } from './pricing-details/submit-pricing/submit-pricing.component';
import { WelcomeMessageComponent } from './home/components/welcome-message/welcome-message.component';
import { staffRouting } from './staff.routing';

@NgModule({
  declarations: [
    CRMPageComponent,
    HomeComponent,
    BuildsPageComponent,
    SchedulePageComponent,
    PricingPageComponent,
    ReportingPageComponent,
    BuildDetailsComponent,
    BuildSummaryCardComponent,
    QuoteTabContentComponent,
    ExtraTabContentComponent,
    AdminPageComponent,
    DevTabComponent,
    BuildManagementTabComponent,
    StaffManagementTabComponent,
    SubbiesManagementTabComponent,
    PricingDetailsComponent,
    PricingSummaryBoardComponent,
    PricingDetailTabComponent,
    PricingStatusComponent,
    PricingAccordionComponent,
    SubmitPricingComponent,
    CopyPricingComponent,
    PngDetailsComponent,
    PricingTotalRowsComponent,
    EditAdminMarginComponent,
    PricingTableComponent,
    PricingRowsComponent,
    NoteLibraryComponent,
    NoteTableComponent,
    NoteComponent,
    PricingNoteChoosingComponent,
    WelcomeMessageComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    staffRouting,
    SharedModule,
    ShellModule,
    MatChipsModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    SpecControlsModule,
    JobsCommonModule,
    FilesModule,
  ],
})
export class StaffModule {}
