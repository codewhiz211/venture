import { Injectable } from '@angular/core';

/**
 * When the user edits the name of a section title (E.g. MainBathroom : Shower) the new value is stored in `custom_fields`
 * E.g.
 *  custom_fields: { mainBathroom: { showerSubTitle: 'Deluxe Shower' } },
 */

@Injectable({
  providedIn: 'root'
})
export class SpecUtilityService {
  // TODO what is this doing and why and when?
  addSlash(spec) {
    const customSections = { ...spec['custom_fields'] };
    for (const section in customSections) {
      if (customSections.hasOwnProperty(section)) {
        for (const field in customSections[section]) {
          if (customSections[section].hasOwnProperty(field)) {
            if (field.indexOf('\\') >= 0) {
              const replaceField = field.replace(/\\/g, '/');
              customSections[section][replaceField] = customSections[section][field];
              delete customSections[section][field];
            }
          }
        }
      }
    }
    return customSections;
  }

  // TODO what is this doing and why and when?
  removeSlash(spec) {
    const customSections = { ...spec['custom_fields'] };
    for (const section in customSections) {
      if (customSections.hasOwnProperty(section)) {
        for (const field in customSections[section]) {
          if (customSections[section].hasOwnProperty(field)) {
            if (field.indexOf('/') >= 0) {
              const replaceField = field.replace(/\//g, '\\');
              customSections[section][replaceField] = customSections[section][field];
              delete customSections[section][field];
            }
          }
        }
      }
    }
    return customSections;
  }
}
