import { Injectable } from '@angular/core';

// NOT YET USED
@Injectable({
  providedIn: 'root'
})
export class PrintStandardService {
  constructor() {}

  /**
   * @description Determine if the specified field should be displayed, based on
   *              conditional rules in config and value in spec
   *
   * @param {object} spec - the current saved spec
   * @param {object} sectionConfig - config for this section
   * @param {object} fieldConfig - config for this field
   */
  public displayConditional(spec, section, field) {
    const names = section.name.split('^');
    let triggerFieldValue, sectionName, index;
    if (names.length === 2) {
      sectionName = names[0];
      index = names[1];
      triggerFieldValue = spec[sectionName][index][field.condition.field];
    } else {
      if (!field.condition) {
        console.error(`${section.name}: field ${field.name} is missing condition property in spec`);
      }
      if (!spec[section.name]) {
        triggerFieldValue = undefined;
      } else {
        triggerFieldValue = spec[section.name][field.condition.field];
      }
    }
    return field.condition.value.startsWith('!')
      ? triggerFieldValue !== field.condition.value.substring(1)
      : triggerFieldValue === field.condition.value;
  }
}
