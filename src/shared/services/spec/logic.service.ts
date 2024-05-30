import { Injectable } from '@angular/core';
import { path } from 'ramda';

/**
 * @description methods for evaluating spec
 *              E.g. should this field be displayed?
 */

@Injectable({
  providedIn: 'root',
})
export class LogicService {
  displayConditionalField(spec, section, field) {
    if (!field || !field.condition) {
      return true;
    }
    let isVersionRight = true;
    if (field.condition.specVersion) {
      //three conditions: n,n+,n-m
      let userSpecVersion = path(['details', 'specVersion'], spec) || 1.0;
      let specVersion = field.condition.specVersion;
      if (specVersion.includes('+')) {
        //n+
        let versionNumber = parseFloat(specVersion);
        isVersionRight = userSpecVersion >= versionNumber;
      } else if (specVersion.includes('-')) {
        //n-m
        let versionNumbers = specVersion.split('-');
        isVersionRight = userSpecVersion >= parseFloat(versionNumbers[0]) && userSpecVersion <= parseFloat(versionNumbers[1]);
      } else {
        //n
        isVersionRight = userSpecVersion == field.condition.specVersion;
      }
    }
    let triggerFieldValue;
    // the trigger field is normally within the section, but IF the condition has a section defined, use that instead.
    if (field.condition.section) {
      if (field.condition.section.split('^') === 2) {
        // NOTE does not support trigger field in another section that is a custom section eg. cladding^0
        console.error('trigger field conditions in other sections cannot be custom');
      }
      triggerFieldValue = spec[field.condition.section][field.condition.field];
    } else {
      let index;
      // trigger field is within same section
      const names = section.name.split('^');
      if (names.length === 2) {
        section = names[0];
        index = names[1];
        if (spec[section][index]) {
          triggerFieldValue = spec[section][index][field.condition.field];
        }
      } else {
        triggerFieldValue = spec[section.name][field.condition.field];
      }
    }

    if (field.condition.value?.startsWith('!')) {
      // negative trigger field. E.g. hide field when value EQUALS trigger value
      return triggerFieldValue !== field.condition.value.substring(1) && isVersionRight;
    } else if (field.condition.value?.indexOf(',') > -1) {
      // multiple values for trigger
      // we only want to HIDE field if no triggers match
      const triggers = field.condition.value.split(',');
      let showField = false;
      triggers.forEach((trigger) => {
        if (triggerFieldValue === trigger) {
          showField = true;
        }
      });
      return showField && isVersionRight;
    } else {
      return triggerFieldValue === field.condition.value && isVersionRight;
    }
  }

  public displayPmField(spec, section, field) {
    // we only want to display the PM notes field if it has been added by user and thus has value in the DB
    return spec[section][field] !== undefined;
  }

  public showConditionField(spec, section, field) {
    const triggerFieldValue = spec[section?.name][field?.hideWhenConditional?.field];

    if (field?.hideWhenConditional?.value?.indexOf(',') > -1) {
      const triggers = field.hideWhenConditional.value.split(',');

      for (const trigger of triggers) {
        if (triggerFieldValue === trigger) {
          field.canHide = field?.hideWhenConditional?.canHide;
          break;
        } else {
          field.canHide = field?.hideWhenConditional?.defaultValue;
        }
      }
      return field.canHide;
    }

    if (triggerFieldValue === field?.hideWhenConditional?.value) {
      return field?.hideWhenConditional?.canHide;
    }

    return field?.hideWhenConditional?.defaultValue;
  }
}
