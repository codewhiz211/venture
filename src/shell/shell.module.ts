import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppChromeBottomNavButtonComponent } from './app-chrome-bottom-nav-button/app-chrome-bottom-nav-button.component';
import { AppChromeBottomNavComponent } from './app-chrome-bottom-nav/app-chrome-bottom-nav.component';
import { AppChromeBottomSheet } from './app-chrome-bottom-sheet/app-chrome-bottom-sheet.component';
import { AppChromeComponent } from './app-chrome/app-chrome.component';
import { AppChromeContentComponent } from './app-chrome-content/app-chrome-content.component';
import { AppChromeContentContainerComponent } from './app-chrome-content-container/app-chrome-content-container.component';
import { AppChromeHeaderButtonsComponent } from './app-chrome-header-buttons/app-chrome-header-buttons.component';
import { AppChromeHeaderComponent } from './app-chrome-header/app-chrome-header.component';
import { AppChromeHeaderTitleComponent } from './app-chrome-header-title/app-chrome-header-title.component';
import { AppChromeMenuComponent } from './app-chrome-menu/app-chrome-menu.component';
import { AppChromeNotificationPanelComponent } from './app-chrome-notification-panel/app-chrome-notification-panel.component';
import { AppChromeSideNavComponent } from './app-chrome-side-nav/app-chrome-side-nav.component';
import { AppChromeSidenavButtonComponent } from './app-chrome-side-nav-button/app-chrome-side-nav-button.component';
import { AppContainerComponent } from './app-container/app-container.component';
import { AppContentComponent } from './app-content/app-content.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { BaseBottomSheetComponent } from './dialogs/base-bottom-sheet/base-bottom-sheet.component';
import { BaseDialog } from './dialogs/base-dialog/base-dialog.component';
import { BottomSheetComponent } from './drawer/bottoms-sheet.component';
import { CommonModule } from '@angular/common';
import { ConnectionStatusComponent } from './connection-status/connection-status.component';
import { DialogContentDirective } from './dialogs/dialog-content.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DrawerContentDirective } from './drawer/drawer-content.directive';
import { EditExtrasComponent } from './drawer/edit-quote/edit-extras/edit-extras.component';
import { EditQuoteComponent } from './drawer/edit-quote/edit-quote.component';
import { EmailModule } from 'src/+email/src/email.module';
import { MarkdownModule } from 'ngx-markdown';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NonStandardOptionsComponent } from './drawer/non-standard-options/non-standard-options.component';
import { PreferenceService } from '@services/preference.service';
import { PublicContainerComponent } from './public-container/public-container.component';
import { QuoteOptionsComponent } from './drawer/edit-quote/quote-options/quote-options.component';
import { RestoreSnapshotComponent } from './drawer/restore-snapshot/restore-snapshot.component';
import { RouterModule } from '@angular/router';
import { ShareChecklistsListComponent } from './drawer/share-spec/share-checklists-list/share-checklists-list.component';
import { ShareFileListComponent } from './drawer/share-spec/share-file-list/share-file-list.component';
import { ShareFoldersListComponent } from './drawer/share-spec/share-folders-list/share-folders-list.component';
import { ShareSpecByLinkButton } from './drawer/share-spec/copy-link-button/share-spec-by-link-button.component';
import { ShareSpecComponent } from './drawer/share-spec/share-spec.component';
import { SharedModule } from '@shared/shared.module';
import { SpecAddNewSectionComponent } from './drawer/spec-add-new-section/spec-add-new-section.component';
import { SpecAuditComponent } from './drawer/spec-audit/spec-audit.component';
import { SpecReOrderComponent } from './drawer/spec-re-order/spec-re-order.component';
import { SpecTrackChangesComponent } from './drawer/spec-track-changes/spec-track-changes.component';
import { TakeSnapshotComponent } from './drawer/take-snapshot/take-snapshot.component';

@NgModule({
  declarations: [
    AppChromeComponent,
    AppChromeHeaderComponent,
    AppChromeHeaderButtonsComponent,
    AppChromeHeaderTitleComponent,
    AppChromeContentComponent,
    AppChromeContentContainerComponent,
    AppChromeSideNavComponent,
    AppChromeBottomNavComponent,
    AppChromeBottomNavButtonComponent,
    AppChromeSidenavButtonComponent,
    AppChromeMenuComponent,
    AppChromeBottomSheet,
    BaseDialog,
    BaseBottomSheetComponent,
    PublicContainerComponent,
    EditQuoteComponent,
    EditExtrasComponent,
    NonStandardOptionsComponent,
    RestoreSnapshotComponent,
    ShareSpecComponent,
    SpecAuditComponent,
    SpecTrackChangesComponent,
    ConnectionStatusComponent,
    TakeSnapshotComponent,
    AppChromeNotificationPanelComponent,
    QuoteOptionsComponent,
    SpecAddNewSectionComponent,
    SpecReOrderComponent,
    ShareSpecByLinkButton,
    //OLD
    AppContainerComponent,
    AppFooterComponent,
    AppHeaderComponent,
    AppContentComponent,
    BottomSheetComponent,
    DialogContentDirective,
    DrawerContentDirective,
    ShareChecklistsListComponent,
    ShareFoldersListComponent,
    ShareFileListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatChipsModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatCardModule,
    MatRadioModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    SharedModule,
    EmailModule,
  ],
  providers: [PreferenceService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    AppChromeComponent,
    AppChromeHeaderComponent,
    AppChromeHeaderButtonsComponent,
    AppChromeHeaderTitleComponent,
    AppChromeContentComponent,
    AppChromeContentContainerComponent,
    AppChromeSideNavComponent,
    AppChromeBottomNavComponent,
    AppChromeBottomNavButtonComponent,
    AppChromeSidenavButtonComponent,
    AppChromeMenuComponent,
    AppChromeNotificationPanelComponent,
    AppChromeBottomSheet,
    BaseDialog,
    BaseBottomSheetComponent,
    PublicContainerComponent,
    EditQuoteComponent,
    NonStandardOptionsComponent,
    RestoreSnapshotComponent,
    ShareSpecComponent,
    SpecAuditComponent,
    SpecTrackChangesComponent,
    ConnectionStatusComponent,
    TakeSnapshotComponent,
    QuoteOptionsComponent,
    SpecAddNewSectionComponent,
    SpecReOrderComponent,
    ShareSpecByLinkButton,
    //OLD
    AppContainerComponent,
    AppFooterComponent,
    AppHeaderComponent,
    AppContentComponent,
    BottomSheetComponent,
    DialogContentDirective,
    DrawerContentDirective,
  ],
  entryComponents: [
    BaseBottomSheetComponent,
    BaseBottomSheetComponent,
    BottomSheetComponent,
    EditQuoteComponent,
    NonStandardOptionsComponent,
    RestoreSnapshotComponent,
    ShareSpecComponent,
    SpecAuditComponent,
    TakeSnapshotComponent,
  ],
})
export class ShellModule {}
