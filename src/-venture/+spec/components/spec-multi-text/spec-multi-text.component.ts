import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { AuditService } from '../../../../shared/services/spec/audit.service';
import { BaseSpecComponent } from '../base-spec.component';
import { EmailValidator } from '@shared/validators/email.validator';
import { FieldConfig } from '../field-config.interface';
import { LoggerService } from '@services/logger.service';
import { SectionConfig } from '../section-config.interface';
import { SpecService } from '@services/spec/spec.service';
import { TrackingService } from '@services/spec/tracking.service';

@Component({
  selector: 'ven-spec-multi-text-field',
  templateUrl: './spec-multi-text.component.html',
  styleUrls: ['./spec-multi-text.component.scss'],
  host: {
    '[class.fullWidth]': 'isFullWidth',
  },
})
export class SpecMultiTextFieldComponent extends BaseSpecComponent implements OnInit, OnChanges {
  @Input() section: SectionConfig;
  @Input() field: FieldConfig;
  @Input() type: string;

  fieldControls: FormControl[] = [];
  isFullWidth: boolean;
  showHint: boolean;

  error: any;
  fieldControl: FormControl;
  lastValue: string[] = [];
  updateInProgress = false;
  updatedFailed: boolean[] = [];
  updatedSucceeded: boolean[] = [];

  constructor(
    private loggerService: LoggerService,
    protected specService: SpecService,
    private trackingService: TrackingService,
    private auditService: AuditService
  ) {
    super();
  }

  ngOnInit() {
    const data = this.getValue();
    this.initialiseFieldControls(data);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['spec']) {
      const data = this.getValue();
      this.initialiseFieldControls(data);
      this.disableFieldsControl();
    }
  }

  public addField() {
    if (this.updateInProgress) {
      return;
    }
    const control = new FormControl('', [this.getValidator()]);
    this.fieldControls.push(control);
    const index = this.fieldControls.length - 1;
    this.lastValue[index] = undefined;
    this.saveField(index, control);
  }

  public removeField(index: number) {
    if (this.updateInProgress) {
      return;
    }
    this.fieldControls.splice(index, 1);
    this.specService.removeMultiField(this.spec.uid, this.section.name, this.field.name, index).subscribe();
    this.lastValue[index] = undefined;
  }

  public getErrorMessage(control) {
    if (this.error) {
      return this.error;
    } else if (control.hasError('email')) {
      return 'Not a valid email';
    }
    return '';
  }

  public saveField(index: number, control: FormControl) {
    if ((this.field.required || this.field.validation) && control.invalid) {
      return;
    }
    if (this.lastValue[index] === control.value) {
      return;
    }
    this.error = undefined;
    this.updatedFailed[index] = this.updatedSucceeded[index] = false;
    control.setErrors(null);

    const changesToSave = {
      [index]: control.value,
    };

    this.updateInProgress = true;
    this.specService.updateMultiField(this.spec.uid, this.section.name, this.field.name, changesToSave).subscribe(
      () => {
        if (this.trackingService.trackChangesEnabled && changesToSave) {
          const key = +Object.keys(changesToSave)[0] + 1;
          const fieldName = `${this.field.display} ${key}`;
          const id = `${this.field.name}-${key}`;
          this.trackingService.addedChangesToTracking(id, this.section.title, fieldName, undefined, changesToSave);
        }
        this.auditService
          .addChangesToAuditNew(
            this.spec.uid,
            `${this.section.name}`,
            { [this.section.name]: { [this.field.name]: changesToSave } },
            this.field.type
          )
          .subscribe();

        // provide some feedback that the field was updated successfully
        this.updateInProgress = false;
        this.updatedSucceeded[index] = true;
        window.setTimeout(() => (this.updatedSucceeded[index] = false), 1000);
      },
      (error) => {
        console.error(error.message ? error.message : error.toString());
        this.updateInProgress = false;
        this.error = 'Could not save data, please try again';
        control.setErrors({ did_not_save: true });
        this.updatedFailed[index] = true;
        window.setTimeout(() => (this.updatedFailed[index] = false), 1000);
      }
    );
  }

  private getValidator() {
    if (this.field.validation) {
      switch (this.field.validation) {
        case 'email':
          return EmailValidator.isValid;

        case 'phone':
          // TODO phone vaidation
          break;

        default:
          break;
      }
    }
    return Validators.nullValidator;
  }

  private getValue() {
    return Object.values(this.spec[this.section.name]?.[this.field.name] || '');
  }

  private initialiseFieldControls(data: any[]) {
    if (data.length) {
      this.fieldControls = [];
      this.lastValue == [];
      if (data.forEach) {
        data.forEach((value, index) => {
          this.fieldControls.push(new FormControl(value, [this.getValidator()]));
          this.lastValue[index] = value;
        });
      } else {
        // TODO is this still sometimes an object?
        // console.error('is object');
      }
    } else {
      this.fieldControls = [new FormControl('', [this.getValidator()])];
    }
  }

  disableFieldsControl() {
    if (this.spec && this.spec.disabled && (this.fieldControls || this.fieldControl)) {
      this.fieldControls.forEach((item: FormControl) => {
        item.disable();
      });
    } else if ((this.spec && this.fieldControls) || this.fieldControl) {
      this.fieldControls.forEach((item: FormControl) => {
        item.enable();
      });
    }
  }
}
