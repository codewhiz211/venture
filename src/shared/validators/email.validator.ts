import { FormControl } from '@angular/forms';

export class EmailValidator {

  static isValid (control: FormControl) {

    if (!control.value) {
      return null;
    }
    // TODO find a better regex
    const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,6})$/.test(control.value);

    if (re) {
      return null;
    }

    return {
      'invalidEmail': true
    };
  }
}
