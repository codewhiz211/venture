import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'ven-autocomplete',
  templateUrl: 'auto-complete.component.html',
  styleUrls: ['auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;
  @Input() fieldControl?: FormControl;
  @Input() fullWidth: boolean = false;
  @Input() label: string;
  @Input() options: any[];
  @Input() optionLabelKey: string;
  @Input() optionValueKey: string;
  @Output() optionChanged = new EventEmitter();

  //TODO update so that we can the display value use optionLabelKey and the code use optionValueKey

  public filteredOptions: Observable<any[]>;
  public autoControl: FormControl;

  ngOnInit() {
    this.autoControl = this.fieldControl || new FormControl();
    this.filteredOptions = this.autoControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value))
    );
  }

  public onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    if (event) {
      const selected = this.options.find(opt => opt[this.optionLabelKey] == event.option.value);
      this.optionChanged.emit(selected);
    }
  }

  public hasRequiredField(): boolean {
    if (!this.autoControl) {
      return false;
    }
    if (this.autoControl.validator) {
      const validator = this.autoControl.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;
  }

  private filter(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.options.filter(option => option[this.optionLabelKey].toLowerCase().includes(filterValue));

    // const item = this.options.find(opt => opt[this.optionValueKey] === value);
    // const filterValue = item ? item[this.optionLabelKey].toLowerCase() : '';
    // return this.options.filter(option => option[this.optionLabelKey].toLowerCase().includes(filterValue));
  }

  public resetValue() {
    this.autocomplete.openPanel();
  }
}
