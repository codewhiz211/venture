import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';

import { BaseSpecFieldComponent } from '../base-spec-field.component';
import { ISupportCustomValues } from '../interfaces';
import { ImageSelectDialogComponent } from './dialog/image-select-dialog';
import { LoggerService } from '@services/logger.service';
import { LogicService } from '@services/spec/logic.service';
import { MatDialog } from '@angular/material/dialog';
import { OtherDialog } from '../spec-other-dialog/other-dialog';
import { SentryService } from '@services/sentry.service';
import { SpecService } from '@services/spec/spec.service';
import { Subject } from 'rxjs';
import { TrackingService } from '@services/spec/tracking.service';
import { WindowService } from '@services/window.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ven-spec-image-picker',
  templateUrl: './spec-image-picker.component.html',
  styleUrls: ['./spec-image-picker.component.scss'],
  host: {
    '[class.hideField]': 'hideField',
  },
})
export class SpecImagePickerComponent extends BaseSpecFieldComponent implements OnInit, OnChanges, ISupportCustomValues {
  @ViewChild('imagePicker') imageSelect;

  public isMobile = false;
  public hideField: boolean = false;
  public selectedItem: any = undefined;
  public displayCustomOptionHint = false;

  public supportsOthers: boolean = false;
  public showTBCImages: boolean = true;
  private isCustom: boolean = false;

  private items: any[] = [];

  private destroy$ = new Subject();

  constructor(
    logger: LoggerService,
    private windowService: WindowService,
    logicService: LogicService,
    specService: SpecService,
    public dialog: MatDialog,
    private dialogService: DialogService,
    trackingService: TrackingService,
    private sentryService: SentryService
  ) {
    super(logger, logicService, specService, trackingService);
    this.isMobile = this.windowService.isMobile;
  }

  private dialogRef;

  ngOnInit() {
    this.items = this.field.items.slice();
    this.initialiseControl();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['spec']) {
      this.supportsOthers = this.field.items.filter((i) => i.display?.toLowerCase().indexOf('other') > -1).length > 0;
      this.initialiseCustomValues();
      this.initialiseControl();
    }
    super.ngOnChanges(changes);
    this.setCustomHint();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initialiseCustomValues() {
    if (this.isCustom) {
      return;
    }
    const customOption = this.getCustomValueForField();
    if (customOption) {
      this.items.unshift({
        display: customOption.value,
        url: '',
        id: customOption.value,
        customValue: true,
      });
      this.isCustom = true;
    }
  }

  private initialiseControl() {
    // the saved value could be id of image in dropdown, or a manual text value for other
    const value = this.getValue();

    if (!value) {
      return;
    }

    if (value !== undefined && this.items.length != 0) {
      this.selectedItem = this.items.filter((i) => i.id === value)[0];
      if (this.selectedItem == undefined) {
        if (this.field.historyItems) {
          this.selectedItem = this.field.historyItems.filter((i) => i.id === value)[0];
        } else {
          if (!this.isCustom) {
            this.sentryService.logError(
              new Error(
                `patching missing custom value "${this.fieldControl.value}" for ${this.spec.uid} ${this.section.name} ${this.field.name}`
              )
            );
          }
        }
      }
    }

    // if selected item is null, the saved value does not match anything in the list,
    // so must be a manually added other value
    if (this.selectedItem) {
      this.fieldControl = this.getValidatedFieldControl(this.selectedItem.id);
    } else {
      this.selectedItem = { display: value, url: undefined, customValue: true };
      this.fieldControl = this.getValidatedFieldControl(value);
    }
    this.showTBCImages = this.items[0] && !this.items[0].noimage;
  }

  setCustomHint() {
    const customOption = this.getCustomValueForField();
    this.displayCustomOptionHint = customOption && !customOption.dismissed && this.fieldControl.value === customOption.value;
  }

  getImageName(imageId) {
    if (!this.selectedItem) {
      return 'Please Select';
    }
    const items = this.items.filter((i) => i.id === imageId);
    return items && items.length > 0 ? items[0].display : imageId;
  }

  getUrl(imageId) {
    const items = this.items.filter((i) => i.id === imageId);
    return items && items.length > 0 ? items[0].url : '';
  }

  openDialog() {
    if (this.spec.disabled) {
      return;
    }

    this.dialogService
      .open(ImageSelectDialogComponent, {
        data: {
          selectedItem: this.selectedItem,
          items: this.items,
        },
        dialogTitle: this.field.display,
        size: DialogSize.Large,
      })
      .subscribe((item) => {
        if (!item) {
          // user cancelled
          return;
        }
        // TODO other and custom should be the same thing!
        if (item.id === 'other' || item.customValue) {
          this.showOtherDialog(item);
          return;
        }
        if (item.id) {
          this.saveValue(item);
        } else {
          // use selected a previously added 'other' value
          this.saveValue(item.display);
        }
      });
  }

  private saveValue(item) {
    const itemId = item.id ? item.id : item;
    super.saveField({
      [this.field.name]: itemId,
      custom_value: { [this.field.name]: this.isCustomValue(itemId) ? itemId : undefined },
    });
  }

  private showOtherDialog(item?) {
    const editingCustomValue = item.customValue;

    this.dialogService
      .open(OtherDialog, {
        data: {
          value: item.customValue ? item?.display : '',
        },
        dialogTitle: 'Please specify',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (!result) {
          // user tabbed. set focus on input
          return;
        }

        if (editingCustomValue) {
          const customItem = this.items.find((i) => i.customValue);
          customItem.id = customItem.display = result;
        } else {
          this.items.unshift({ id: result, display: result, url: undefined, customValue: true });
        }
        this.saveValue(result);
      });
  }

  private isCustomValue(currValue) {
    if (currValue) {
      return this.items.find((item) => item.id === currValue && item.customValue);
    }
    return false;
  }
}
