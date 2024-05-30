import { Pipe, PipeTransform } from '@angular/core';

/**
 * Used to determine if a spec has custom values
 */
@Pipe({
  name: 'customValuesExist'
})
export class CustomValuesExistPipe implements PipeTransform {
  /**
   * Does this spec have any custom values?
   * @param value spec.custom_values
   */
  transform(value: any): boolean {
    if (!value) {
      return false;
    }
    const sectionKeys = Object.keys(value);

    if (sectionKeys.length === 0) {
      return false;
    }
    return sectionKeys.some(sectionKey => {
      return Object.values(value[sectionKey]).filter((o: any) => o && !o.dismissed).length > 0;
    });
  }
}
