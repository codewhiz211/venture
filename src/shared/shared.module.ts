import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { angularMaterialModules, angularModules, thirdPartyModules } from './shared.module.imports';

import { AppCancelButtonComponent } from '@shared/components/buttons/app-cancel-button/app-cancel-button.component';
import { AppChromeDetailContentComponent } from '@shell/app-chrome-details-content/app-chrome-details-content.component';
import { AppChromeDetailsPageComponent } from '@shell/app-chrome-details-page/app-chrome-details-page.component';
import { AppChromeDetailsPageFooterComponent } from '@shell/app-chrome-details-page-footer/app-chrome-details-page-footer.component';
import { AppChromeDetailsPageHeaderComponent } from '@shell/app-chrome-details-page-header/app-chrome-details-page-header.component';
import { AppChromeDialogFooterButtonsComponent } from '@shell/app-dialog-footer-buttons/app-dialog-footer-buttons.component';
import { AppChromeLoaderComponent } from '@shell/app-chrome-loader/app-chrome-loader.component';
import { AppPrimaryButtonComponent } from '@shared/components/buttons/app-primary-button/app-primary-button.component';
import { AppWhiteButtonComponent } from '@shared/components/buttons/app-white-button/app-white-button.component';
import { AutoCompleteComponent } from './components/auto-complete/auto-complete.component';
import { BaseComponent } from './components/base.component';
import { ChecklistService } from '@services/checklist.service';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationPhraseDialogComponent } from './dialogs/confirmation-phrase-dialog/confirmation-phrase-dialog.component';
import { DetailsViewButtonComponent } from './components/details-view-button/details-view-button.component';
import { ErrorMessageComponent } from './components/error-message.component';
import { ExtraAmountComponent } from './components/extra-amount/extra-amount.component';
import { ExtrasListComponent } from './components/extras-list/extras-list.component';
import { FileUploaderEngineComponent } from './components/file-uploader-engine/file-uploader-engine.component';
import { IconComponent } from './icons/icon-component/icon.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MatDialogRef } from '@angular/material/dialog';
import { NoSavedCardComponent } from './components/no-saved-card/no-saved-card.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PipesModule } from './pipes/pipes.module';
import { PricingOptionSummarySectionComponent } from './components/pricing/pricing-option-summary-section/pricing-option-summary-section.component';
import { QuoteAmountComponent } from './components/quote-amount/quote-amount.component';
import { SavedCardsBoardComponent } from './components/saved-cards-board/saved-cards-board.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchableTableComponent } from './components/searchable-table/searchable-table.component';
import { SignatureSignComponent } from './components/signature-sign/signature-sign.component';
import { SignatureSignPadComponent } from './components/signature-sign-pad/signature-sign-pad.component';
import { SpecAccordionMenuComponent } from './components/spec/spec-accordion-menu/spec-accordion-menu.component';
import { SpecEditSectionComponent } from './components/spec/spec-edit-section/spec-edit-section.component';
import { SpeedDialComponent } from './components/speed-dial/speed-dial.component';
import { StaffDetailComponent } from './components/staff-detail/staff-detail.component';
import { StatusComponent } from './components/status/status.component';
import { StatusDropdownComponent } from './components/status-dropdown/status-dropdown.component';
import { SubbieDetailComponent } from './components/subbie-detail/subbie-detail.component';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { SwitchCasesDirective } from './directives/switch-case.directive';
import { TablePlaceholderComponent } from './components/table-placeholder/table-placeholder.component';
import { TableSearchBarComponent } from './components/table-search-bar/table-search-bar.component';
import { TrackChangesModalComponent } from './components/track-changes-modal/track-changes-modal.component';
import { VenFabButtonComponent } from '@shell/app-chrome-details-page-footer/ven-fab-button/ven-fab-button.component';
import { VenInputComponent } from './components/ven-input/ven-input.component';
import { VenMenuComponent } from './components/ven-menu/ven-menu.component';
import { VenTableComponent } from './components/ven-table/ven-table.component';
import { VenTextareaComponent } from './components/ven-textarea/ven-textarea.component';
import { VersionComponent } from './components/version.component';

@NgModule({
  declarations: [
    AppChromeDetailsPageComponent,
    AppChromeDetailsPageHeaderComponent,
    AppChromeDetailsPageFooterComponent,
    VenFabButtonComponent,
    AppChromeLoaderComponent,
    IconComponent,
    AppChromeDetailContentComponent,
    AppPrimaryButtonComponent,
    AppWhiteButtonComponent,
    AppCancelButtonComponent,
    AppChromeDialogFooterButtonsComponent,
    AutoCompleteComponent,
    LoaderComponent,
    SignatureSignComponent,
    SignatureSignPadComponent,
    SpecAccordionMenuComponent,
    SpecEditSectionComponent,
    StatusDropdownComponent,
    TrackChangesModalComponent,
    BaseComponent,
    ErrorMessageComponent,
    VersionComponent,
    ConfirmationDialogComponent,
    ConfirmationPhraseDialogComponent,
    SwitchCasesDirective,
    ExtraAmountComponent,
    SearchableTableComponent,
    SearchBarComponent,
    TablePlaceholderComponent,
    TableSearchBarComponent,
    VenTableComponent,
    SpeedDialComponent,
    DetailsViewButtonComponent,
    NotificationComponent,
    StatusComponent,
    QuoteAmountComponent,
    ExtrasListComponent,
    FileUploaderEngineComponent,
    StaffDetailComponent,
    SubbieDetailComponent,
    SummaryCardComponent,
    NoSavedCardComponent,
    SavedCardsBoardComponent,
    VenInputComponent,
    VenTextareaComponent,
    VenMenuComponent,
    PricingOptionSummarySectionComponent,
    ComingSoonComponent,
  ],
  imports: [...angularModules, ...angularMaterialModules, ...thirdPartyModules, PipesModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    AppChromeDetailsPageComponent,
    AppChromeDetailsPageHeaderComponent,
    AppChromeDetailsPageFooterComponent,
    AppChromeLoaderComponent,
    IconComponent,
    AppPrimaryButtonComponent,
    AppWhiteButtonComponent,
    AppCancelButtonComponent,
    AppChromeDialogFooterButtonsComponent,
    AutoCompleteComponent,
    LoaderComponent,
    SignatureSignComponent,
    SignatureSignPadComponent,
    SpecAccordionMenuComponent,
    SpecEditSectionComponent,
    StatusDropdownComponent,
    TrackChangesModalComponent,
    BaseComponent,
    ErrorMessageComponent,
    VersionComponent,
    ConfirmationDialogComponent,
    ConfirmationPhraseDialogComponent,
    SwitchCasesDirective,
    SearchBarComponent,
    ExtraAmountComponent,
    TablePlaceholderComponent,
    TableSearchBarComponent,
    SearchableTableComponent,
    VenTableComponent,
    SpeedDialComponent,
    DetailsViewButtonComponent,
    SpecEditSectionComponent,
    NotificationComponent,
    StatusComponent,
    QuoteAmountComponent,
    ExtrasListComponent,
    FileUploaderEngineComponent,
    StaffDetailComponent,
    SubbieDetailComponent,
    SummaryCardComponent,
    NoSavedCardComponent,
    SavedCardsBoardComponent,
    VenInputComponent,
    VenTextareaComponent,
    VenMenuComponent,
    PricingOptionSummarySectionComponent,
    ComingSoonComponent,
  ],
  providers: [ChecklistService],
  entryComponents: [],
})
export class SharedModule {}
