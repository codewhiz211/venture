import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '../drawer.service';
import { ExtrasService } from '@services/spec/extras.service';
import { SpecService } from '@services/spec/spec.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ven-edit-quote',
  templateUrl: './edit-quote.component.html',
  styleUrls: ['./edit-quote.component.scss'],
})
export class EditQuoteComponent implements OnInit {
  @Input() data: any;

  public quote;
  public quoteForm: FormGroup;
  public loading = false;
  public errorMessage = '';
  public selectedExtras = [];
  public extras = {};
  private allExtras = [];

  public showQuoteEditor: boolean;

  public submitAction = {
    label: 'SAVE',
    handler: () => this.onSaveClick(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };

  constructor(
    private drawer: DrawerService,
    private dialogService: DialogService,
    private specService: SpecService,
    private extrasService: ExtrasService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    const spec = this.data.spec;
    this.quote = this.data.quote;
    const quoteTab = this.data.quoteTab;
    this.quoteForm = this.formBuilder.group({
      turnkeyFee: [this.quote.turnkeyFee],
      autoCalcTurnkey: [this.quote.autoCalcTurnkey === undefined ? true : this.quote.autoCalcTurnkey],
      includeGST: [this.quote.includeGST === undefined ? true : this.quote.includeGST],
    });

    if (quoteTab) {
      // Quote tab; once 'Prepared for contract' they should not be able to edit anything on the quote
      this.allExtras = spec.details.postContract ? [] : this.extrasService.getAllPreContractExtras(spec);
      this.showQuoteEditor = true;
    } else {
      // Extras tab; Blank slate until 'Prepared for contract', then once the extras tab is live, there will be an edit button to change the pre-defined values
      this.allExtras = spec.details.postContract ? this.extrasService.getAllPostContractExtras(spec) : [];
      this.showQuoteEditor = false;
    }
    this.selectedExtras = [].concat(this.allExtras);

    // Set Turnkey Fee input to required when !autoCalcTurnkey
    this.quoteForm.controls.autoCalcTurnkey.valueChanges.subscribe((val) => {
      this.quoteForm.controls.turnkeyFee.setValidators(!!val ? null : Validators.required);
      this.quoteForm.controls.turnkeyFee.updateValueAndValidity();
      this.quoteForm.controls.turnkeyFee.reset(this.quoteForm.value.turnkeyFee); // To reset error state as if untouched
    });
  }

  onExtrasModified(extras) {
    this.extras = extras;
  }

  setQuote(quote) {
    this.quote = quote;
  }

  onSaveClick() {
    this.loading = true;
    this.errorMessage = '';
    const quoteData: any = {
      ...this.quote,
      turnkeyFee: this.quoteForm.value.turnkeyFee,
      autoCalcTurnkey: this.quoteForm.value.autoCalcTurnkey,
      includeGST: this.quoteForm.value.includeGST,
    };

    const updatedExtras = [];
    Object.keys(this.extras).forEach((key) => {
      if (this.extras[key].modified) {
        updatedExtras.push(this.extras[key]);
      }
    });

    // when save update the quote on the spec and refresh local spec
    forkJoin([
      this.specService.updateExtraAmounts(this.data.spec.uid, this.allExtras, updatedExtras),
      this.specService.updateQuote(this.data.uid, quoteData),
    ]).subscribe(
      () => {
        this.loading = false;
        this.onCancelClick();
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error.message ? error.message : error.toString();
      }
    );
  }

  onCancelClick() {
    this.quoteForm.reset();
    this.dialogService.closeActiveDialog();
    this.drawer.close(); // left only for old shell, need to be removed after old shell deprecated.
  }
}
