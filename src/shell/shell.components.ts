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
import { AppChromeSideNavComponent } from './app-chrome-side-nav/app-chrome-side-nav.component';
import { AppChromeSidenavButtonComponent } from './app-chrome-side-nav-button/app-chrome-side-nav-button.component';
import { AppContainerComponent } from './app-container/app-container.component';
import { AppContentComponent } from './app-content/app-content.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { BaseBottomSheetComponent } from './dialogs/base-bottom-sheet/base-bottom-sheet.component';
import { BaseDialog } from './dialogs/base-dialog/base-dialog.component';
import { BottomSheetComponent } from './drawer/bottoms-sheet.component';
import { ConnectionStatusComponent } from './connection-status/connection-status.component';
import { DialogContentDirective } from './dialogs/dialog-content.directive';
import { DrawerContentDirective } from './drawer/drawer-content.directive';
import { EditQuoteComponent } from './drawer/edit-quote/edit-quote.component';
import { NonStandardOptionsComponent } from './drawer/non-standard-options/non-standard-options.component';
import { PublicContainerComponent } from './public-container/public-container.component';
import { RestoreSnapshotComponent } from './drawer/restore-snapshot/restore-snapshot.component';
import { ShareSpecComponent } from './drawer/share-spec/share-spec.component';
import { SpecAuditComponent } from './drawer/spec-audit/spec-audit.component';
import { TakeSnapshotComponent } from './drawer/take-snapshot/take-snapshot.component';
import { without } from 'ramda';

export const shellComponents = [
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
  NonStandardOptionsComponent,
  RestoreSnapshotComponent,
  ShareSpecComponent,
  SpecAuditComponent,
  ConnectionStatusComponent,
  TakeSnapshotComponent,
  //OLD
  AppContainerComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppContentComponent,
  BottomSheetComponent,
  DialogContentDirective,
  DrawerContentDirective,
];

export const shellEntryComponents = [
  BaseBottomSheetComponent,
  BaseBottomSheetComponent,
  BottomSheetComponent,
  EditQuoteComponent,
  NonStandardOptionsComponent,
  RestoreSnapshotComponent,
  ShareSpecComponent,
  SpecAuditComponent,
  TakeSnapshotComponent,
];

export const publicShellComponents = without([BottomSheetComponent], shellComponents);
