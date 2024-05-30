import { FormControl } from '@angular/forms';

export class DecimalValidator {

    static isValid(control: FormControl) {
        if (control.value === '' || control.value === undefined) {
            return null;
        }
        const number = /^-?[.\d]+$/.test(control.value) ? +control.value : NaN;
        if (number !== number) {
            return { 'decimal': true };
        }
        return null;
    }
}
