import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isHidden',
  pure: true
})
export class IsHiddenPipe implements PipeTransform {
  transform(hiddenSections: any, sectionName: string, fieldName?: string): boolean {
    if (fieldName) {
      return showHideField(hiddenSections, sectionName, fieldName);
    }

    return showHideSection(hiddenSections, sectionName);
  }
}

/**
 * A field is hidden if it is explicitly set to TRUE
 * @param hiddenSections
 * @param sectionName
 * @param fieldName
 */
export const showHideField = (hiddenSections, sectionName, fieldName) => {
  if (!hiddenSections[sectionName] || hiddenSections[sectionName] === {}) {
    return false;
  }
  if (hiddenSections[sectionName][fieldName]) {
    return true;
  }
  return false;
};
/**
 * A section is hidden if it is explicitly set to TRUE
 * @param hiddenSections
 * @param sectionName
 * @param fieldName
 */
export const showHideSection = (hiddenSections, sectionName) => {
  return hiddenSections[sectionName] === true;
};
