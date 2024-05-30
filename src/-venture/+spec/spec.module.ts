// Modules 3rd party
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { A11yModule } from '@angular/cdk/a11y';
import { ActionMenuComponent } from './components/action-menu/action-menu.component';
import { BaseAutocompleteComponent } from './components/base-autocomplete.component';
import { BaseSpecFieldComponent } from './components/base-spec-field.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { ElectricalPackageComponent } from './components/spec-electrical/electrical-package/electrical-package.component';
import { ExtrasModule } from '../extras/extras.module';
import { FilesModule } from 'src/+files/src/files.module';
import { ImageSelectDialogComponent } from './components/spec-image-picker/dialog/image-select-dialog';
import { JobsCommonModule } from '@jobs/jobs-common.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OtherDialog } from './components/spec-other-dialog/other-dialog';
import { PipesModule } from '@shared/pipes/pipes.module';
import { QuoteModule } from '../quote/quote.module';
import { RouterModule } from '@angular/router';
import { ShareExtrasDialogComponent } from './components/share-extras-dialog/share-extras-dialog.component';
import { SharedModule } from '@shared/shared.module';
import { ShellModule } from '@shell/shell.module';
import { SpecAccordionComponent } from './components/spec-accordion/spec-accordion.component';
import { SpecAttachImageComponent } from './components/spec-attach-image/spec-attach-image.component';
import { SpecContentsComponent } from './components/spec-contents/spec-contents.component';
import { SpecCustomManagerComponent } from './components/spec-custom-manager/spec-custom-manager.component';
import { SpecCustomValueNotificationComponent } from './components/spec-custom-value-notification/spec-custom-value-notification.component';
import { SpecDropComponent } from './components/spec-drop/spec-drop.component';
import { SpecElectricalComponent } from './components/spec-electrical/spec-electrical.component';
import { SpecExtrasComponent } from './components/spec-extras/spec-extras.component';
import { SpecExtrasDropdownComponent } from './components/spec-extras-dropdown/spec-extras-dropdown.component';
import { SpecFieldComponent } from './components/spec-text-field/spec-text-field.component';
import { SpecHeaderComponent } from './components/spec-header/spec-header.component';
import { SpecImagePickerComponent } from './components/spec-image-picker/spec-image-picker.component';
import { SpecMultiTextFieldComponent } from './components/spec-multi-text/spec-multi-text.component';
import { SpecNumberComponent } from './components/spec-number/spec-number.component';
import { SpecNumberConditionalComponent } from './components/spec-number-conditional/spec-number-conditional.component';
// Spec Components
import { SpecPageComponent } from './components/spec-page/spec-page.component';
import { SpecPlaceholderComponent } from './components/spec-placeholder/spec-placeholder.component';
import { SpecRouting } from './spec.routing';
import { SpecSpeedDialComponent } from './components/spec-speed-dial/spec-speed-dial.component';
import { SpecSubtitleConditionalComponent } from './components/spec-subtitle-conditional/spec-subtitle-conditional.component';
import { SpecTextAreaComponent } from './components/spec-text-area/spec-text-area.component';
import { SpecTextAreaConditionalComponent } from './components/spec-text-area-conditional/spec-text-area-conditional.component';
import { SpecTextFieldConditionalComponent } from './components/spec-text-field-conditional/spec-text-field-conditional.component';
import { SpecTextFieldOptionalComponent } from './components/spec-text-field-optional/spec-text-field-optional.component';
import { SpecUpdateStandardElectricalComponent } from './components/spec-update-standard-electrical/spec-update-standard-electrical.component';
import { SpecViewFileComponent } from './components/spec-view-image/spec-view-file.component';
import { RequestPricingComponent } from './components/spec-extras/request-pricing/request-pricing.component';

@NgModule({
  declarations: [
    ActionMenuComponent,
    SpecPageComponent,
    SpecAccordionComponent,
    SpecHeaderComponent,
    SpecContentsComponent,
    SpecPlaceholderComponent,
    SpecFieldComponent,
    SpecTextAreaComponent,
    BaseSpecFieldComponent,
    BaseAutocompleteComponent,
    SpecExtrasComponent,
    SpecImagePickerComponent,
    SpecCustomManagerComponent,
    SpecNumberComponent,
    SpecExtrasDropdownComponent,
    SpecElectricalComponent,
    SpecDropComponent,
    ImageSelectDialogComponent,
    ElectricalPackageComponent,
    SpecTextFieldConditionalComponent,
    SpecTextAreaConditionalComponent,
    SpecNumberConditionalComponent,
    ShareExtrasDialogComponent,
    SpecMultiTextFieldComponent,
    SpecSubtitleConditionalComponent,
    OtherDialog,
    SpecAttachImageComponent,
    SpecViewFileComponent,
    SpecUpdateStandardElectricalComponent,
    SpecTextFieldOptionalComponent,
    SpecSpeedDialComponent,
    SpecCustomValueNotificationComponent,
    RequestPricingComponent,
  ],
  imports: [
    // ANGULAR
    CommonModule,

    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // MD
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatInputModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatDialogModule,
    MatSidenavModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatBottomSheetModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatSelectModule,
    MatChipsModule,
    MatRadioModule,
    MatSlideToggleModule,
    DragDropModule,
    ShellModule,
    SharedModule,
    // APP
    FilesModule,
    QuoteModule,
    JobsCommonModule,
    ExtrasModule,
    SpecRouting,
    A11yModule,
    MatButtonToggleModule,
    EcoFabSpeedDialModule,
    MatTooltipModule,
    JobsCommonModule,
    PipesModule,
  ],
  exports: [
    ActionMenuComponent,
    SpecPageComponent,
    SpecAccordionComponent,
    SpecHeaderComponent,
    SpecContentsComponent,
    SpecPlaceholderComponent,
    SpecFieldComponent,
    SpecTextAreaComponent,
    BaseSpecFieldComponent,
    BaseAutocompleteComponent,
    SpecExtrasComponent,
    SpecImagePickerComponent,
    SpecCustomManagerComponent,
    SpecNumberComponent,
    SpecExtrasDropdownComponent,
    SpecElectricalComponent,
    SpecDropComponent,
    ImageSelectDialogComponent,
    ElectricalPackageComponent,
    SpecTextFieldConditionalComponent,
    SpecTextAreaConditionalComponent,
    SpecNumberConditionalComponent,
    ShareExtrasDialogComponent,
    SpecMultiTextFieldComponent,
    SpecSubtitleConditionalComponent,
    OtherDialog,
    SpecAttachImageComponent,
    SpecViewFileComponent,
    SpecUpdateStandardElectricalComponent,
    SpecTextFieldOptionalComponent,
    SpecSpeedDialComponent,
    SpecCustomValueNotificationComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ImageSelectDialogComponent, ShareExtrasDialogComponent, OtherDialog, SpecUpdateStandardElectricalComponent],
})
export class SpecModule {}
