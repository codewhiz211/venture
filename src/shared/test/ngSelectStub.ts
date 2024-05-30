import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Component } from '@angular/core';

//This mock component is used to fix testing error:  'No value accessor for form control with name'
@Component({
  selector: 'mat-select',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MatSelectStubComponent,
      multi: true,
    },
  ],
})
export class MatSelectStubComponent implements ControlValueAccessor {
  writeValue(obj: any) {}
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}
  setDisabledState(isDisabled: boolean) {}
}

@Component({
  selector: 'mat-checkbox',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MatCheckboxStubComponent,
      multi: true,
    },
  ],
})
export class MatCheckboxStubComponent implements ControlValueAccessor {
  writeValue(obj: any) {}
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}
  setDisabledState(isDisabled: boolean) {}
}
