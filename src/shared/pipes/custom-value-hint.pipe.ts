import { Pipe, PipeTransform } from '@angular/core';
import { path } from 'ramda';

/**
 * Used to determine if we need to display a hint when shared (print)
 */
@Pipe({
  name: 'customValueHint'
})
export class CustomValueHintPipe implements PipeTransform {
  /**
   * Does this field have a custom value?
   * @param value spec.custom_values
   * @param sectionName
   * @param fieldName
   */
  transform(value: any, sectionName: string, fieldName: string): boolean {
    const hint = path([sectionName, fieldName], value);
    return hint && !hint.dismissed;
  }
}
