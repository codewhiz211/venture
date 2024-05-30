import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { EVENT_TYPE, IDrawerEvent } from '../drawer/drawer-content.interfaces';

import { BaseBottomSheetComponent } from './base-bottom-sheet/base-bottom-sheet.component';
import { BaseDialog } from './base-dialog/base-dialog.component';
import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { WindowService } from '@services/window.service';
import { mergeRight } from 'ramda';

export enum DialogSize {
  Normal = 0,
  Large = 1,
}

export interface IDialogConfig {
  closeButton?: boolean; // display a X close button (dialogs only). Use this if the injected content has no buttons.
  data?: any; // data for the injected component will be assigned to data property unless dataKey defined
  dataKey?: string; // inject component data on this property instead of the default "data"
  dialogTitle?: string;
  options?: IDialogOptions; // MatDialog Option overrides and button names
  size?: DialogSize;
}

export interface IDialogOptions {
  disableClose?: boolean;
  height?: string;
  minHeight?: string;
  panelClass?: string;
  width?: string;
  autoFocus?: boolean;
}

const SIZE_NORMAL = {
  height: '50vh',
  width: '40%',
};

const SIZE_LARGE = {
  height: '80vh',
  width: '70%',
};

const DEFAULT_OPTIONS: IDialogOptions = {
  disableClose: false,
  minHeight: '50vh',
  ...SIZE_NORMAL,
};

/* This service will is used to open a dialog / bottom sheet.

ON desktop it opens a dialog.
ON mobile/ tablet it opens a bottom drawer.

In each case the component provided in the config param is injected into a wrapper base component.
- Desktop => base-dialog
- Mobile => base-bottom-sheet

The injected content is responsible for
- styling it's content including padding etc
- providing buttons to submit and form entered inside the injected content

Note. Bottom sheets have a default close button. So injected content does not need to specify one.
      Dialogs must have a close button specified in config OR the closeButton param should be set in config.

      */

// consider renaming to DrawerService / Detail Service once we have remove old code
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  // Note: this can be either a Dialog or a BottomSheet
  private _activeDialog: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly _activeDialog$: Observable<any> = this._activeDialog.asObservable();

  //to support multiple opened dialog
  private dialogRefStack = [];

  private events: Subject<IDrawerEvent> = new Subject();
  public readonly events$: Observable<IDrawerEvent> = this.events.asObservable();

  constructor(
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private specActiveService: SpecActiveService,
    private windowService: WindowService
  ) {}

  public closeActiveDialog(value = undefined) {
    const activeDialog: any = this._activeDialog.value;

    const isDesktop = this.windowService.isDesktop;

    if (isDesktop) {
      activeDialog.close(value);
    } else {
      activeDialog.dismiss(value);
    }

    const dialogIndex = this.dialogRefStack.findIndex((dialog) => dialog == activeDialog);
    if (dialogIndex) {
      this.dialogRefStack.splice(dialogIndex, 1);
    }
    if (this.dialogRefStack.length > 0) {
      this._activeDialog.next(this.dialogRefStack[this.dialogRefStack.length - 1]);
    }

    this.specActiveService.closeSectionAction(); // TODO this might not be needed in new shell?
  }

  /**
   * This will open a dialog on desktop and a bottom sheet on mobile
   * @param component - the content component to inject into the dialog
   * @param config - see IDialogConfig
   */
  public open(component: any, config?: IDialogConfig) {
    const isDesktop = this.windowService.isDesktop;

    if (isDesktop) {
      return this.openDialog(component, config).afterClosed();
    } else {
      return this.openBottomSheet(component, config);
    }
  }

  // TODO untested
  public raiseEvent(type: EVENT_TYPE, data?: any) {
    this.events.next({ type, data });
  }

  private openBottomSheet(component: any, config?: IDialogConfig) {
    const options = {
      data: {
        dialogComponent: component,
        dialogData: config?.data,
        dataKey: config?.dataKey || 'data',
        dialogTitle: config?.dialogTitle || '',
      },
    };
    const bottomSheetRef = this.bottomSheet.open(BaseBottomSheetComponent, options);

    this.dialogRefStack.push(bottomSheetRef);

    this._activeDialog.next(bottomSheetRef);

    return bottomSheetRef.afterDismissed();
  }

  private openDialog(component: any, config?: IDialogConfig) {
    let options = mergeRight(DEFAULT_OPTIONS, { data: { dialogComponent: component } });

    if (config) {
      const dialogSize = config.size ? config.size : DialogSize.Normal;
      const optionsWithSize = dialogSize === DialogSize.Normal ? DEFAULT_OPTIONS : mergeRight(DEFAULT_OPTIONS, SIZE_LARGE);
      const optionsWithUserOptions = mergeRight(optionsWithSize, config.options);

      options = mergeRight(optionsWithUserOptions, {
        data: {
          dialogComponent: component,
          dialogData: config.data,
          dataKey: config.dataKey || 'data',
          dialogTitle: config?.dialogTitle || '',
          closeButton: config?.closeButton,
        },
      });
    }

    const dialogRef = this.dialog.open(BaseDialog, options);

    this.dialogRefStack.push(dialogRef);

    this._activeDialog.next(dialogRef);

    return dialogRef;
  }
}
