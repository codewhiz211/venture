import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { keys, path } from 'ramda';

import { BaseSpecComponent } from './base-spec.component';
import { FieldConfig } from './field-config.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@services/logger.service';
import { LogicService } from '@services/spec/logic.service';
import { SectionConfig } from './section-config.interface';
import { SpecService } from '@services/spec/spec.service';
import { Subject } from 'rxjs';
import { TrackingService } from '@services/spec/tracking.service';
import { hintsConfig } from '@shared/config/spec-config';
import { takeUntil } from 'rxjs/operators';
import { ventureLogger } from 'src/venture.logger';

@Component({
  selector: 'ven-base-spec-field',
  template: '',
})
export class BaseSpecFieldComponent extends BaseSpecComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() section: SectionConfig;
  @Input() field: FieldConfig;

  protected data: any;
  protected hideField: boolean = true;
  protected isFullWidth: boolean;
  public showHint: any;
  public saveInProgress: boolean = false;
  private _destroy: Subject<any> = new Subject();

  error: any;
  fieldControl: FormControl;
  updatedFailed: boolean;
  updatedSucceeded: boolean;

  protected lastFieldValue: any;

  /**
   * @description Base class for all controls.  Whenever the spec changes, this base class ensures that the control state is updated
   */
  constructor(
    protected loggerService: LoggerService,
    protected logicService: LogicService,
    protected specService: SpecService,
    protected trackingService: TrackingService
  ) {
    super();
    this.fieldControl = new FormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.loggerService.trace(JSON.stringify(Object.keys(changes).map(key => key)));
    if (changes['spec']) {
      this.isFullWidth = this.field.fullWidth;
      const data = this.getValue();
      this.fieldControl = this.getValidatedFieldControl(data);
      this.showHideField();
      this.setShowHint();
      this.setCustomError();
      this.disableFormControl();
      this.updateConditionHideField();
    }
  }

  ngAfterViewInit(): void {
    // set value if already exist
    this.lastFieldValue = this.fieldControl.value;
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  getErrorMessage() {
    if (this.error) {
      return this.error;
    } else if (this.fieldControl.hasError('required')) {
      return 'You must enter a value';
    } else if (this.fieldControl.hasError('email')) {
      return 'Not a valid email';
    }
    return '';
  }

  getValue() {
    if (this.isMultiField(this.section.name)) {
      const names = this.section.name.split('*');
      // multi field, that allows multiple values for a field
      // E.g. details.emails: []
      if (!this.spec[names[0]]) {
        this.loggerService.warn(`${names[0]} does not exist`);
        return undefined;
      }
      if (!this.spec[names[0]][names[1]]) {
        this.loggerService.warn(`${names[0]}:${names[1]} does not exist`);
        return undefined;
      }
      return this.spec[names[0]][names[1]];
    }
    // to support custom blocks added by the user the section name
    // can be dot separated, where the value after the dot is an index
    const names = this.section.name.split('^');
    let data;
    if (names.length === 2) {
      // custom field saved to  section : idx : field
      if (!this.spec[names[0]]) {
        this.loggerService.warn(`${names[0]} does not exist`);
        return undefined;
      }
      if (!this.spec[names[0]][names[1]]) {
        this.loggerService.warn(`${names[0]}:${names[1]} does not exist`);
        return undefined;
      }
      data = this.spec[names[0]][names[1]][this.field.name];
    } else {
      if (!this.spec[this.section.name]) {
        this.loggerService.warn(`${this.section.name} does not exist`);
        return undefined;
      }
      // standard field saved to section : field
      data = this.spec[this.section.name][this.field.name];
    }
    if (!data && this.field.default) {
      data = this.field.default;
    }
    return data;
  }

  getValidatedFieldControl(data): FormControl {
    const validators = [];
    if (this.field.type === 'text') {
      switch (this.field.validation) {
        case 'email':
          validators.push(Validators.email);
          break;

        case 'phone':
          // TODO phone validation
          // validators.push(Validators.email);
          break;

        default:
          break;
      }
    }
    if (this.field.required) {
      validators.push(Validators.required);
    }
    return new FormControl(data, validators);
  }

  saveField(changes?: any) {
    let customValue = '';
    if (changes?.custom_value) {
      customValue = changes.custom_value;
      delete changes.custom_value;
    }
    if (!this.fieldControl) {
      return;
    }
    if (this.fieldControl.invalid) {
      return;
    }
    if (changes) {
      if (this.lastFieldValue === changes[this.field.name]) {
        this.loggerService.warn(`not saving ${this.field.name} because value ${changes[this.field.name]} has not changed`);

        return;
      }
    } else if (this.lastFieldValue === this.fieldControl.value) {
      this.loggerService.warn(`not saving ${this.field.name} because value ${this.lastFieldValue} has not changed`);

      return;
    }
    this.saveInProgress = true;
    this.error = undefined;
    this.updatedFailed = this.updatedSucceeded = false;
    this.fieldControl.setErrors(null);

    const changesToSave = changes || {
      [this.field.name]: this.fieldControl.value,
    };
    ventureLogger('changes', changes);
    this.specService
      .updateSpec(this.spec.uid, this.section, this.field, changesToSave, customValue)
      .pipe(takeUntil(this._destroy))
      .subscribe(
        (values) => {
          this.trackPrefillChanges(this.section, values);

          this.trackingService.trackChangesIfTrackingActive(this.spec, this.section, this.field, changesToSave);

          // provide some feedback that the field was updated successfully
          this.lastFieldValue = changes ? changes[this.field.name] : this.fieldControl.value;
          this.updatedSucceeded = true;
          this.saveInProgress = false;
          window.setTimeout(() => (this.updatedSucceeded = false), 1000);
        },
        (error) => {
          //error but not error.message will leave the error stack.
          console.error(error);
          this.error = 'Could not save data, please try again';
          this.fieldControl.setErrors({ did_not_save: true });
          this.updatedFailed = true;
          this.saveInProgress = false;

          window.setTimeout(() => (this.updatedFailed = false), 1000);
        }
      );
  }

  highlightPmNotes() {
    if (this.spec.disabled) {
      return;
    }
    this.specService.highlightField(this.spec.uid, this.section.name, this.field.name).subscribe(
      () => {},
      (err: HttpErrorResponse) => console.error(err)
    );
  }

  resetFieldChanges(field) {
    const changes = {
      [field]: '',
    };
    this.specService.updateSpec(this.spec.uid, this.section, {}, changes).subscribe(
      () => {},
      (error) => {
        console.error(error);
        this.error = 'Could not save data, please try again';
        this.fieldControl.setErrors({ did_not_save: true });
        this.updatedFailed = true;
        window.setTimeout(() => (this.updatedFailed = false), 1000);
      }
    );
  }

  private trackPrefillChanges(section, values) {
    if (!this.trackingService.trackChangesEnabled || values.length === 0 || values[0] == null) {
      return;
    }
    const prefillChanges = values.filter((v) => !keys(v).some((r) => ['details', 'lastModified'].includes(r)));
    if (prefillChanges.length === 0 || prefillChanges[0] == null) {
      return;
    }
    const prefillChange = prefillChanges[0];
    const fields = keys(prefillChange);

    fields.forEach((fieldName) => {
      const fieldInfo = section.fields ? section.fields.find((f) => f.name === fieldName) : this.field;
      const value = path([fieldName], prefillChange);
      this.trackingService.trackChangesIfTrackingActive(this.spec, section, fieldInfo, { [fieldName]: value });
    });
  }

  protected makeKeySafe(key: string): string {
    return key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
  }

  protected getCustomValueForField() {
    const customValue = path([this.section.name, this.field.name], this.spec.custom_value);
    if (!customValue) {
      return null;
    }
    return customValue;
  }

  private isMultiField(sectionName) {
    // * is used to denote a field that can have multiple values (E.g. client email).
    // the field will start with one control and save to index 0 fo array, but further fields can be added
    return sectionName.indexOf('*') > -1;
  }

  private showHideField() {
    // when the spec changes, check to see if the field should display (conditional field)
    this.hideField = !this.logicService.displayConditionalField(this.spec, this.section, this.field);
  }

  private setCustomError() {
    // only custom cladding currently has errors
    if (this.field.errors) {
      const names = this.section.name.split('^');
      if (names[0] === 'cladding-additional') {
        // custom field saved to  section : idx : field
        if (!this.spec[names[0]]) {
          this.loggerService.warn(`${names[0]} does not exist`);
          return undefined;
        }
        if (!this.spec[names[0]][names[1]]) {
          this.loggerService.warn(`${names[0]}:${names[1]} does not exist`);
          return undefined;
        }
        this.error = this.spec[names[0]][names[1]][`${this.field.name}_error`];
      }
    }
  }

  private setShowHint() {
    this.showHint = undefined;
    if (this.field.hint) {
      const associatedHints = hintsConfig.filter((h) => h.field === this.field.name);
      if (associatedHints.length > 0) {
        if (associatedHints[0].value === 'ALWAYS') {
          this.showHint = associatedHints[0].text;
          return;
        }
      }
      const names = this.section.name.split('^');

      if (names.length === 2) {
        // custom field saved to  section : idx : field
        if (!this.spec[names[0]]) {
          this.loggerService.warn(`${names[0]} does not exist`);
          return undefined;
        }
        if (!this.spec[names[0]][names[1]]) {
          this.loggerService.warn(`${names[0]}:${names[1]} does not exist`);
          return undefined;
        }
        this.showHint = this.spec[names[0]][names[1]][`${this.field.name}_hint`];
      } else {
        this.showHint = this.spec[names[0]][`${this.field.name}_hint`];
      }
    }
  }

  private disableFormControl() {
    if (this.spec.disabled) {
      this.fieldControl.disable();
    } else {
      this.fieldControl.enable();
    }
  }

  private updateConditionHideField() {
    if (!this.field?.hideWhenConditional) {
      return;
    }
    this.field.canHide = this.logicService.showConditionField(this.spec, this.section, this.field);
  }
}
