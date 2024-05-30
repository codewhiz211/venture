import { BehaviorSubject, Observable } from 'rxjs';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

import { ClientSpec } from '@interfaces/client-spec.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SectionConfig } from '../section-config.interface';
import { SpecService } from '@services/spec/spec.service';
import { TrackingService } from '@services/spec/tracking.service';

const reducer = (accumulator, currentValue) => {
  return accumulator + parseFloat(currentValue.amount);
};

@Component({
  selector: 'ven-spec-extras-dropdown',
  templateUrl: './spec-extras-dropdown.component.html',
  styleUrls: ['./spec-extras-dropdown.component.scss'],
})
export class SpecExtrasDropdownComponent implements OnInit, OnChanges {
  @Input() spec: ClientSpec;
  @Input() section: SectionConfig;

  public client$: Observable<ClientSpec>;

  public optionalExtrasConfig: any; // TODO type

  // For some reason this needs to be an observable, otherise it never updates
  private _extras$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public readonly extras$: Observable<any[]> = this._extras$.asObservable();

  public extrasForm: FormGroup;
  public total: number = 0;
  public totalCount$: Observable<number>;

  sectionTitle: string;
  specUid: string;
  error: any;
  updatedFailed: boolean;
  updatedSucceeded: boolean;
  items: any[] = [];

  constructor(
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private specService: SpecService,
    private trackingService: TrackingService
  ) {}

  // NOTE: selected options will ve saved to spec.options[section]

  ngOnInit() {
    this.extrasForm = this.formBuilder.group({
      item: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
    this.disableForm();
    this.optionalExtrasConfig = this.section.optionalExtras;
    this.sectionTitle = this.optionalExtrasConfig.title;
    this.items = this.optionalExtrasConfig.items;
    this.updateExtrasList(this.spec);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['spec']) {
      const spec = changes['spec'].currentValue;
      this.specUid = spec.uid;
      this.updateExtrasList(spec);
      this.disableForm();
    }
  }

  updateExtrasList(spec) {
    let extras = [];
    if (spec['extras_optional'][this.section.name]) {
      // @ts-ignore
      extras = [...spec['extras_optional'][this.section.name]];
      this._extras$.next(spec['extras_optional'][this.section.name]);
    } else {
      this._extras$.next([]);
    }
    this.total = this.calculateTotal(extras);
  }

  showToast() {
    this.snackBar.open('Cannot add extras in pre-contract', undefined);
  }

  public trackItem(index: number, item: any) {
    return item.item;
  }

  getErrorMessage() {
    return '';
  }

  private calculateExtraAmount(formData) {
    // the amount will be the config amount times the quantity
    const optionName = formData.controls.item.value;
    const optionConfig = this.optionalExtrasConfig.items.find((o) => o.item === optionName);
    const amount = optionConfig.amount;
    return amount * formData.controls.quantity.value;
  }

  onAddItem(formData: any, formDirective: FormGroupDirective) {
    const extras = this._extras$.getValue();
    if (this.extrasForm.invalid) {
      return;
    }

    // why the extra reset?
    // See: https://stackoverflow.com/questions/48216330/angular-5-formgroup-reset-doesnt-reset-validators/48217303#48217303
    const extra = {
      display: formData.controls.item.value,
      item: formData.controls.item.value, // TODO ch2645; is this needed?
      postContract: this.spec.details.postContract,
      quantity: formData.controls.quantity.value,
      amount: this.calculateExtraAmount(formData),
      optional: true,
      field: `${this.section.title}_optional`,
      addedStatus: this.spec.details.status,
    };
    // add to local array
    extras.push(extra);
    this.total = this.calculateTotal(extras);

    // udpate server
    this.updateOnServer().subscribe(
      () => {
        if (this.trackingService.trackChangesEnabled) {
          const id = `${this.section.name}-${extra.field}-${extra.amount}`;
          this.trackingService.addedChangesToTracking(id, `${this.section.title} / ${this.section.title} Option`, '', undefined, {
            amount: `${extra.display}($${extra.amount})`,
          });
        }
        this.extrasForm.reset();
        formDirective.resetForm();
        this._extras$.next(extras);
        // provide some feedback that the field was updated successfully
        this.updatedSucceeded = true;
        window.setTimeout(() => (this.updatedSucceeded = false), 1000);
      },
      (error) => {
        // reset data
        const index = extras.indexOf(extra);
        extras.splice(index, 1);
        this.total = this.calculateTotal(extras);
        this._extras$.next(extras);
        //
        console.error(error.message ? error.message : error.toString());
        this.error = 'Could not save data, please try again';
        this.updatedFailed = true;
        window.setTimeout(() => (this.updatedFailed = false), 1000);
      }
    );
  }

  onRemoveItem(extra) {
    const extras = this._extras$.getValue();
    const index = extras.indexOf(extra);
    const removed = extras.splice(index, 1);
    this.total = this.calculateTotal(extras);

    this.updateOnServer().subscribe(
      () => {
        /* do nothing */
      },
      (error) => {
        // reset data
        extras.push(removed);
        this.total = this.calculateTotal(extras);
        this._extras$.next(extras);
        //
        console.error(error.message ? error.message : error.toString());
        this.error = 'Could not save data, please try again';
        this.updatedFailed = true;
        window.setTimeout(() => (this.updatedFailed = false), 1000);
      }
    );
  }

  private disableForm() {
    if (this.spec && this.extrasForm) {
      if (this.spec.disabled) {
        this.extrasForm.get('item').disable();
        this.extrasForm.get('quantity').disable();
      } else {
        this.extrasForm.get('item').enable();
        this.extrasForm.get('quantity').enable();
      }
    }
  }

  updateOnServer() {
    const extras = this._extras$.getValue();
    this.error = undefined;
    this.updatedFailed = this.updatedSucceeded = false;
    return this.specService.updateSpec(
      this.specUid,
      'extras_optional',
      {},
      {
        [this.section.name]: extras,
      }
    );
  }
  private calculateTotal(extras) {
    return this.spec.details.status == 'Prepared for contract'
      ? extras.filter((item) => item.addedStatus != 'Quote').reduce(reducer, 0)
      : extras.reduce(reducer, 0);
  }
}
