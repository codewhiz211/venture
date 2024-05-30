import { BehaviorSubject, Observable } from 'rxjs';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

import { ClientSpec } from '@interfaces/client-spec.interface';
import { DecimalValidator } from '@shared/validators/decimal.validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestPricingComponent } from './request-pricing/request-pricing.component';
import { SectionConfig } from '../section-config.interface';
import { SpecService } from '@services/spec/spec.service';
import { TrackingService } from '@services/spec/tracking.service';

const reducer = (accumulator, currentValue) => {
  return currentValue.amount == 'pending' ? accumulator : accumulator + parseFloat(currentValue.amount);
};

@Component({
  selector: 'ven-spec-extras',
  templateUrl: './spec-extras.component.html',
  styleUrls: ['./spec-extras.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecExtrasComponent implements OnInit, OnChanges {
  @Input() spec: ClientSpec;
  @Input() section: SectionConfig;

  public client$: Observable<ClientSpec>;

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

  constructor(
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private specService: SpecService,
    private trackingService: TrackingService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.sectionTitle = this.section.title;
    this.initialiseForm();
    this.updateExtrasList(this.spec);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['spec']) {
      const spec = changes['spec'].currentValue;
      this.specUid = spec.uid;
      this.initialiseForm();
      this.updateExtrasList(spec);
    }
  }

  private initialiseForm() {
    this.extrasForm = this.formBuilder.group({
      item: [{ value: '', disabled: this.spec.disabled }],
      amount: [{ value: '', disabled: this.spec.disabled }, Validators.compose([DecimalValidator.isValid])],
    });
  }

  updateExtrasList(spec) {
    // we need to display both types of extra (pre & post contract)
    let extras = [];
    if (spec['extras_manual'][this.section.name]) {
      extras = extras.concat(this.getCopy(spec['extras_manual'][this.section.name]));
      extras = extras.filter((e) => e.display); // remove placeholders
    }
    this._extras$.next(extras);
    this.total = this.calculateTotal(extras);
  }

  showToast() {
    this.snackBar.open('Cannot add extras in pre-contract', undefined);
  }

  public trackItem(item: any) {
    return item.item; // TODO; ch2645 Should this be display?
  }

  getErrorMessage() {
    return '';
  }

  onAddItem(formData: any, formDirective: FormGroupDirective) {
    const extras = this._extras$.getValue();
    if (this.extrasForm.invalid) {
      return;
    }
    if (formData.controls.item.value === undefined || formData.controls.item.value === '') {
      return;
    }
    // why the extra reset?
    // See: https://stackoverflow.com/questions/48216330/angular-5-formgroup-reset-doesnt-reset-validators/48217303#48217303
    const extra = {
      display: formData.controls.item.value,
      amount: formData.controls.amount.value,
      field: `${this.section.name}_manual`,
      addedStatus: this.spec.details.status,
    };

    this.specService.addManualExtra(this.section.name, extra).subscribe(
      () => {
        // todo move if check inside service method
        if (this.trackingService.trackChangesEnabled) {
          const id = `${extra.field}-${extra.display}-${extra.amount}`;
          this.trackingService.addedChangesToTracking(id, `${this.section.title} / ${this.section.title} Extras`, '', undefined, {
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

    this.specService.removeManualExtra(this.specUid, this.section.name, index).subscribe(
      () => {},
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

  updateOnServer() {
    const extras = this._extras$.getValue();
    this.error = undefined;
    this.updatedFailed = this.updatedSucceeded = false;
    return this.specService.updateSpec(
      this.specUid,
      'extras',
      {},
      {
        [this.section.name]: extras,
      }
    );
  }

  onRequestPricing() {
    this.dialogService.open(RequestPricingComponent, {
      data: {
        spec: this.spec,
        section: this.section,
      },
      dialogTitle: 'Request Pricing',
      size: DialogSize.Large,
    });
  }

  private getCopy(inputArray) {
    if (inputArray) {
      return inputArray.slice ? inputArray.slice(0) : [];
    }
    return [];
  }

  private calculateTotal(extras) {
    return this.spec.details.status == 'Prepared for contract'
      ? extras.filter((item) => item.addedStatus != 'Quote').reduce(reducer, 0)
      : extras.reduce(reducer, 0);
  }
}
