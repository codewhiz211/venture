import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { BaseSpecFieldComponent } from '../base-spec-field.component';
import { ClientSpec } from '@interfaces/client-spec.interface';
import { DialogService } from '@shell/dialogs/dialog.service';
import { ISupportCustomValues } from '../interfaces';
import { LoggerService } from '@services/logger.service';
import { LogicService } from '@services/spec/logic.service';
import { MatSelectChange } from '@angular/material/select';
import { OtherDialog } from '../spec-other-dialog/other-dialog';
import { SentryService } from '@services/sentry.service';
import { SpecService } from '@services/spec/spec.service';
import { Subject } from 'rxjs';
import { TrackingService } from '@services/spec/tracking.service';
import { takeUntil } from 'rxjs/operators';

/**
 * Present user a list of options, the last of which is other.
 * When other selected, show user a dialog to add custom option.
 *
 */
@Component({
  selector: 'ven-spec-droppicker',
  templateUrl: './spec-drop.component.html',
  styleUrls: ['./spec-drop.component.scss'],
  host: {
    '[class.fullWidth]': 'isFullWidth',
    '[class.hideField]': 'hideField',
  },
})
export class SpecDropComponent extends BaseSpecFieldComponent implements OnInit, OnChanges, ISupportCustomValues {
  @ViewChild('specDropdown', { static: false }) dropDown;
  @Input() spec: ClientSpec;

  public inputElement;
  public items = [];
  public displayCustomOptionHint = false;
  public historyItem;

  private destroy$ = new Subject();

  constructor(
    loggerService: LoggerService,
    logicService: LogicService,
    specService: SpecService,
    trackingService: TrackingService,
    private dialogService: DialogService,
    private sentryService: SentryService,
    private cref: ChangeDetectorRef
  ) {
    super(loggerService, logicService, specService, trackingService);
  }

  ngOnInit() {
    // cannot map items until here
    this.items = this.field.items.slice().map((item) => {
      return {
        display: item,
        value: item,
      };
    });
    const isCustom = this.initialiseCustomValues();
    if (this.fieldControl.value != null && !this.field.items.find((item) => item == this.fieldControl.value)) {
      if (this.field.historyItems) {
        const historyValue = this.field.historyItems.find((item) => item == this.fieldControl.value);
        this.historyItem = {
          display: historyValue,
          value: historyValue,
        };
      } else {
        // to fix the custom_value is lost in Firebase
        if (!isCustom) {
          this.items.unshift({
            display: this.fieldControl.value,
            value: this.fieldControl.value,
            customValue: true,
          });
          // patch the lost custom_value item into firebase
          this.specService
            .updateCustomOption(this.spec, this.section, this.field, { [`${this.field.name}_custom`]: this.fieldControl.value })
            .subscribe();
          this.sentryService.logError(
            new Error(
              `patching missing custom value "${this.fieldControl.value}" for ${this.spec.uid} ${this.section.name} ${this.field.name}`
            )
          );
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.initialiseControl();
    this.setCustomHint();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelectionChanged(event: MatSelectChange) {
    // when an option is selected, we need to provide the change
    if (event) {
      if (event.value.indexOf('Other') > -1) {
        this.fieldControl.setValue('Other - Please Specify');
        this.showDialog();
      } else {
        this.saveValue(event.value);
      }
    }
  }

  setCustomHint() {
    const customOption = this.getCustomValueForField();
    this.displayCustomOptionHint = customOption && !customOption.dismissed && this.fieldControl.value === customOption.value;
  }

  saveCustomEdits(value) {
    this.updateCustomValue(value);
    this.saveValue(value);
  }

  private initialiseCustomValues() {
    const customOption = this.getCustomValueForField();
    if (customOption) {
      this.items.unshift({
        display: customOption.value,
        value: customOption.value,
        customValue: true,
      });
      return true;
    }
    return false;
  }

  private updateCustomValue(value) {
    const currentCustomValue = this.items.find((i) => i.customValue);
    currentCustomValue.display = value;
    currentCustomValue.value = value;
  }

  private initialiseControl() {
    const value = this.getValue();

    if (!value) {
      return;
    }

    if (this.items.filter((i) => i.value === value).length === 0) {
      this.fieldControl = this.getValidatedFieldControl(value);
    }
  }

  private showDialog() {
    this.dialogService
      .open(OtherDialog, {
        dialogTitle: 'Please specify',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (!result) {
          this.fieldControl.setValue(this.lastFieldValue);
          this.cref.detectChanges();
          return;
        }
        if (this.items[0]?.customValue) {
          this.items.shift();
        }
        this.items.unshift({ display: result, value: result, customValue: true });
        this.fieldControl.setValue(result);
        this.saveValue(result);
      });
  }

  private saveValue(value) {
    super.saveField({
      [this.field.name]: value,
      custom_value: { [this.field.name]: this.isCustomValue(value) ? value : undefined },
    });
  }

  private isCustomValue(currValue) {
    if (currValue) {
      return !this.field.items.find((item) => item === currValue);
    }
    return false;
  }
}
