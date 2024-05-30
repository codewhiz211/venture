import { assoc, assocPath, curry, includes, isEmpty, keys, mergeDeepLeft, path, pathOr, pipe } from 'ramda';
import { errorsConfig, hintsConfig } from '../../config/spec-config';
import { findIndex, omit, whereEq } from 'ramda';

import { CONSULTANTS } from '../../config/spec-config/consultants';
import { Injectable } from '@angular/core';
import { PROJECT_MANAGERS } from '../../config/spec-config/projectMangers';
import { QUANTITY_SURVEYORS } from '../../config/spec-config/quantitySurveyors';
import { SectionType } from '../../interfaces/spec.inteface';

// Ensure correct path used for Field type. E.g. return path to block field for custom types
// Not declared on service as 'this' is not available within the pipe
const getPathToField = (sectionName, fieldName) => {
  const names = sectionName.split('^');
  if (names.length > 1) {
    return [names[0], names[1], fieldName];
  }
  return [sectionName, fieldName];
};

const createExtra = (currentSpec, extra, changes, field) => {
  return {
    item: changes[field.name],
    display: extra.display,
    amount: extra.amount,
    field: field.name,
    postContract: currentSpec.details.postContract,
  };
};

/**
 * Creates appropriate JSON blobs to update the DB with.
 * The main reason fo using a service for this is so that we can test the formatting.
 * TODO: type currentSpec
 */
@Injectable({
  providedIn: 'root',
})
export class SpecFormatterService {
  /*
   * It is expected that the JSON objects created here will be used in a PATCH request to update the DB
   * The PATCH request only updates named keys, and leaves other unmodified.
   * However, it does not do this recursively, meaning if a property is an object, we need to supply any properties we want to keep.
   *
   * E.g. we are clearing extras here for SectionName property,
   *      but since each section property is an object (or array), we spread the existing values to avoid them being lost.
    const extras = {
      ...currentSpec.extras,
      [sectionName]: []
    };

    TODO: to avoid having to send the current sibling values of an item being updated we could be smart and work out from the change object,
      which parts of the tree need to update and create a PATCH for each portion (instead one big patch object as we do currently)
   *
   **/

  public getAddCustomBlockChanges(currentSpec: any, sectionName: string, index: number, block: object) {
    return {
      [sectionName]: { [index]: block },
    };
  }

  public getRemoveCustomBlockChanges(currentSpec: any, sectionName: string, index: number) {
    const currentBlocks = currentSpec[sectionName] || [];
    currentBlocks.splice(index, 1);
    return {
      [sectionName]: currentBlocks,
      extras: {
        [`${sectionName}^${index}`]: null,
      },
    };
  }

  public getAddManualExtra(currentSpec: any, sectionName: string, extra: object) {
    const currentExtras = currentSpec['extras_manual'][sectionName] || [];
    return {
      extras_manual: {
        ...currentSpec['extras_manual'],
        [sectionName]: [
          // @ts-ignore
          ...currentExtras,
          {
            ...extra,
            postContract: currentSpec.details.postContract,
          },
        ],
      },
    };
  }

  public getRemoveManualExtra(currentSpec: any, sectionName: string, index: number) {
    const currentExtras = currentSpec['extras_manual'][sectionName] || [];

    // sanity check that there are extras before we remove them
    if (currentExtras.length > 0) {
      currentExtras.splice(index, 1);

      // create change object for server
      const extraChanges = {};
      extraChanges[sectionName] = currentExtras;

      return {
        extras_manual: {
          ...currentSpec['extras_manual'],
          [sectionName]: [...currentExtras],
        },
      };
    }
  }

  public getDismissCustomValueChange(currentSpec: any, sectionName: string, fieldName: string) {
    const currentCustomValues = currentSpec.custom_value;
    const currentSectionCustomValues = pathOr({}, [sectionName], currentCustomValues);
    const customValueChanges = {
      [sectionName]: {
        ...currentSectionCustomValues,
        [fieldName]: {
          dismissed: true,
          value: currentSectionCustomValues[fieldName].value,
        },
      },
    };
    const updateCustomValues = {
      ...currentCustomValues,
      ...customValueChanges,
    };
    return { custom_value: updateCustomValues };
  }

  public getHighlightFieldChanges(currentSpec, sectionName, fieldName) {
    const changesToSave = {
      [fieldName]: !pathOr(false, ['highlighted_notes', sectionName, fieldName], currentSpec),
    };
    return {
      highlighted_notes: {
        [sectionName]: changesToSave,
      },
    };
  }

  public getHideSectionChanges(currentSpec: any, sectionName: string) {
    const hiddenSections = {
      [sectionName]: true,
    };

    // @ts-ignore
    const extras = {
      [sectionName]: [],
    };
    // @ts-ignore
    const extras_manual = {
      [sectionName]: [],
    };

    // @ts-ignore
    const extras_optional = {
      // @ts-ignore
      [sectionName]: [],
    };

    const changes = {
      hiddenSections,
      extras,
      extras_manual,
      extras_optional,
    };
    return changes;
  }

  public getHideSubSectionChanges(currentSpec, sectionName, subSectionName) {
    let hiddenSections;
    if (currentSpec.hiddenSections[sectionName]) {
      hiddenSections = {
        [sectionName]: {
          [subSectionName]: true,
        },
      };
    } else {
      hiddenSections = {
        [sectionName]: {
          [subSectionName]: true,
        },
      };
    }

    return {
      hiddenSections,
    };
  }

  public getShowSectionChanges(sectionName) {
    // mark the section as visible, also initialise extras properties to empty
    // a placeholder is required else firebase does not add the property
    return {
      extras: {
        [sectionName]: [{ dummy: true }],
      },
      extras_manual: {
        [sectionName]: [{ dummy: true }],
      },
      extras_optional: {
        [sectionName]: [{ dummy: true }],
      },
      hiddenSections: {
        [sectionName]: false,
      },
    };
  }

  public getShowSubSectionChanges(sectionName, subSectionName) {
    return {
      hiddenSections: {
        [sectionName]: {
          [subSectionName]: false,
        },
      },
    };
  }

  public getAddNewSectionChanges(sectionName, data, orderList) {
    return {
      [sectionName]: data,
      custom_sections: {
        [sectionName]: data.title,
      },
      sort: {
        orderList,
      },
    };
  }

  public getUpdateSectionChanges(sectionName, changes) {
    return {
      [sectionName]: {
        ...changes,
      },
    };
  }

  public getUpdateSpecOrderChanges(newOrder) {
    return {
      sort: { orderList: newOrder },
    };
  }

  public getUpdateSectionNameChanges(sectionName, title) {
    return {
      [sectionName]: {
        title,
      },
    };
  }

  public getUpdateSubSectionNameChanges(sectionName, subSectionName, title) {
    return {
      custom_fields: {
        [sectionName]: {
          [subSectionName]: title,
        },
      },
    };
  }

  public getUpdateMultiFieldChanges(currentSpec, sectionName, fieldName, changes): any {
    // const names = sectionName.split('*');
    const currentValues = currentSpec[sectionName][fieldName] || [];
    const change = changes[Object.keys(changes)[0]];
    currentValues[Object.keys(changes)[0]] = change;
    const orderedChange = this.reIndexArray(currentValues);
    return {
      [sectionName]: {
        [fieldName]: orderedChange,
      },
    };
  }

  public getRemoveMultiFieldChanges(currentSpec, sectionName, fieldName, index): any {
    const currentValues = currentSpec[sectionName][fieldName] || [];
    currentValues.splice(index, 1);
    const orderedChange = this.reIndexArray(currentValues);
    return {
      [sectionName]: {
        [fieldName]: orderedChange,
      },
    };
  }

  // allExtras contains all configured; extras contains only distinct extras that have been modified
  // E.g. if Brick seal is added to multiple cladding custom blocks we only edit it once
  // but we need to update all configured when price changes
  // E.g cladding brick seal could be on one or more custom blocks. Then we would need to check all other blocks,
  // and update the price there also.
  public getUpdateExtrasChanges(currentSpec, allExtras, extras) {
    const extraChanges = currentSpec.extras;
    const extrasManualChanges = currentSpec.extras_manual;
    const extrasOptionalChanges = currentSpec.extras_optional;

    extras.forEach((extra) => {
      const extrasToUpdate = allExtras.filter((e) => e.display === extra.display);

      extrasToUpdate.forEach((ex) => {
        if (extra.type === 'extras') {
          this.addExtra(extraChanges, extra, ex);
        } else if (extra.type === 'extras_manual') {
          this.addExtra(extrasManualChanges, extra, ex);
        } else if (extra.type === 'extras_optional') {
          this.addExtra(extrasOptionalChanges, extra, ex);
        }
      });
    });

    const newExtras = {
      extras: extraChanges,
      extras_manual: extrasManualChanges,
      extras_optional: extrasOptionalChanges,
    };
    return newExtras;
  }

  private addExtra(changes, extra, ex) {
    if (changes[ex.section] === undefined) {
      changes[ex.section] = [];
    }
    const modifiedIndex = findIndex(whereEq({ fieldIndex: extra.fieldIndex }), changes[ex.section]);
    if (modifiedIndex != -1) {
      extra.includeInBuildPrice = !!extra.includeInBuildPrice;
      changes[ex.section][modifiedIndex] = omit(['item', 'section', 'type', 'fieldIndex', 'modified', 'gross', 'gst', 'net'], extra);
    }
  }

  public getUpdateQuoteChanges(quoteChanges) {
    return {
      quote: {
        ...quoteChanges,
        lastModified: Date.now(),
      },
    };
  }

  public combineUserAndDefinedSections(spec, sections) {
    // TODO refactor now that is covered by a test
    if (!sections) {
      return [];
    }

    const customSectionKeys = [];
    if (spec.custom_sections) {
      // @ts-ignore
      customSectionKeys.push(...Object.keys(spec.custom_sections));
    }

    // give all standard sections a type so we can tell them apart from free/duplicate
    // improve this when we refactor this code
    const _sections = [...sections.map((s) => assoc('type', SectionType.Default, s))];

    customSectionKeys.forEach((key) => {
      if (sections.findIndex((el) => el.name === key) === -1 && spec[key]) {
        _sections.push(spec[key]);
      }
    });
    const sectionsList = [];
    _sections.forEach((el, i) => {
      // el can be undefined if DB has been used with previous versions of this feature
      if (el) {
        if (spec[el.name] && spec[el.name].title) {
          const index = _sections.findIndex((sect) => sect.name === el.name);
          _sections[index] = Object.assign({}, _sections[index]);
          _sections[index]['title'] = spec[el.name].title;
        }
        if (_sections[i] && _sections[i].name) {
          sectionsList.push(_sections[i]);
        }
      }
    });
    if (spec.sort && spec.sort.orderList) {
      const currentOrderList = [...spec.sort.orderList];
      //As the contact_details is new section, if the orderList doesn't include it, then insert it at the first place into the orderList
      if (!currentOrderList.includes('contact_details')) {
        currentOrderList.unshift('contact_details');
      }
      if (currentOrderList.length !== sectionsList.length) {
        sectionsList.forEach((key) => {
          if (currentOrderList.indexOf(key.name) === -1) {
            currentOrderList.push(key.name);
          }
        });
      }
      return this.sortSectionOrder(currentOrderList, sectionsList);
    } else {
      const order = [];
      sectionsList.forEach((item) => order.push(item.name));
      return this.sortSectionOrder(order, sectionsList);
    }
  }

  /**
   * User has updated an item in the spec.
   * This change may require, hints, errors, custom values or extras to be set.
   * I.e. we *may* need to update several parts of the DB.
   * This method creates an object that can be used to patch the DB with all necessary updates
   *
   * @param currentSpec
   * @param section
   * @param field
   * @param changes
   */
  public getUpdateSpecChanges(currentSpec, section, field, changes): any {
    let sectionName;
    if (section.name) {
      sectionName = section.name;
    } else {
      sectionName = section;
    }

    const getCoreChangesMethod =
      sectionName.split('^').length > 1
        ? curry(this.getCustomBlockFieldUpdate)(currentSpec, sectionName, changes)
        : curry(this.getStandardFieldUpdate)(currentSpec, sectionName, changes);

    const updates = pipe(
      getCoreChangesMethod,
      // each method from here will receive an update object as the last param, which it should modify and return
      curry(this.getHintChanges)(currentSpec, sectionName, field, changes),
      curry(this.getErrorChanges)(currentSpec, sectionName, field, changes),
      curry(this.getPreFillChanges)(currentSpec, sectionName, field, changes),
      curry(this.getCustomValueChanges)(currentSpec, sectionName, field, changes),
      curry(this.getExtrasChanges)(currentSpec, sectionName, field, changes),
      curry(this.deleteEmptyObjects)(currentSpec, sectionName, field, changes)
    )({});

    return updates;
  }

  public getClientChanges(field, changes) {
    const clientChanges: any = {};
    if (
      includes(field.name, [
        'client',
        'consultantEmail',
        'consultantName',
        'lot',
        'projectManagerEmail',
        'projectManagerName',
        'scheme',
        'subdivision',
      ])
    ) {
      clientChanges[field.name] = changes[field.name];
    }
    return clientChanges;
  }

  public getStatusChanges(status) {
    return {
      status: status,
      postContract: status !== 'Quote',
    };
  }

  private getCustomBlockFieldUpdate(currentSpec: any, sectionName: string, changes: object, updates: any) {
    const names = sectionName.split('^');
    const customSection = names[0];
    const blockIndex = names[1];
    updates[customSection] = {};
    updates[customSection][blockIndex] = mergeDeepLeft(changes, currentSpec[customSection][blockIndex] || {});

    return updates;
  }

  private getStandardFieldUpdate(currentSpec: any, sectionName: string, changes: object, updates: any) {
    updates = {
      [sectionName]: {
        ...changes,
      },
    };
    return updates;
  }

  /**
   * Some fields have themselves, or cause other fields to have hints displayed
   */
  private getHintChanges(currentSpec: any, sectionName, field, changes, updates) {
    const potentialHints = hintsConfig.filter((h) => h.field === field.name || h.sourceField === field.name);
    if (potentialHints.length === 0) {
      return updates;
    }

    // NOTE: section is wrong for custom, but only Exterior currently uses updateHints, so ignore for now
    const section = currentSpec[sectionName];
    if (field?.updateHints) {
      field.updateHints.forEach((hintField) => {
        const hint = hintsConfig.filter((h) => h.field === hintField);
        if (section[hintField] !== changes[field.name] && section[hintField]) {
          updates[sectionName][`${hintField}_hint`] = hint[0].text;
        } else {
          updates[sectionName][`${hintField}_hint`] = undefined;
        }
      });
    }

    // remove hints for this field
    updates = assocPath(getPathToField(sectionName, `${field.name}_hint`), null, updates);

    // then set if hint persists
    for (let h = 0; h < potentialHints.length; h++) {
      const hint = potentialHints[h];
      if (hint.field === field.name || hint.sourceField === field.name) {
        if (hint['valExpression']) {
          const _val = hint['value'].replace(/value/g, path(getPathToField(sectionName, hint.field), updates));
          if (eval.call(this, _val)) {
            updates = assocPath(getPathToField(sectionName, `${hint.field}_hint`), hint.text, updates);
            return updates;
          }
        }
        if (hint.value === 'ALWAYS') {
          updates = assocPath(getPathToField(sectionName, `${hint.field}_hint`), hint.text, updates);
          return updates;
        }
        if (hint?.compareWith) {
          if (section[hint?.compareWith] && path(getPathToField(sectionName, hint?.field), updates) !== section[hint?.compareWith]) {
            updates = assocPath(getPathToField(sectionName, `${hint?.field}_hint`), hint.text, updates);
          }
          return updates;
        }
        if (hint.value === path(getPathToField(sectionName, hint.field), updates)) {
          updates = assocPath(getPathToField(sectionName, `${hint.field}_hint`), hint.text, updates);
          return updates;
        } else if (hint.sourceField) {
          const sourceValue = path(getPathToField(sectionName, hint.sourceField), currentSpec);
          const hintMsg = sourceValue === hint.value ? hint.text : null;
          if (hintMsg) {
            updates = assocPath(getPathToField(sectionName, `${hint.field}_hint`), hint.text, updates);
            return updates;
          }
        }
      }
    }
    return updates;
  }

  /**
   * Some fields have conditions which if met result in errors displayed in the spec
   */
  private getErrorChanges(currentSpec, sectionName, field, changes, updates) {
    // we know it is cladding, but still need to get the index
    const names = sectionName.split('^');
    let section, index;
    if (names.length === 2) {
      section = names[0];
      index = names[1];
    }

    // currently we only support errors on cladding
    if (section !== 'cladding-additional') {
      return updates;
    }

    // currently only cladding has errors...
    // to simplify code, just cater for clading errors
    // if the source changes, remove both lrv errors
    if (field.name === 'claddingType') {
      updates = assocPath(getPathToField(sectionName, `lrv1_error`), null, updates);
      updates = assocPath(getPathToField(sectionName, `lrv2_error`), null, updates);
    } else {
      // else just clear the one we are about to check
      updates = assocPath(getPathToField(sectionName, `${field.name}_error`), null, updates);
    }

    const potentialErrors = errorsConfig.filter((e) => e.field === field.name || e.sourceField === field.name);

    // then set if error persists
    for (let e = 0; e < potentialErrors.length; e++) {
      const error = potentialErrors[e];
      if (error.field === field.name || error.sourceField === field.name) {
        if (currentSpec) {
          const fieldValue = changes[field.name];
          const sourceValue = field.name === error.sourceField ? fieldValue : path([section, index, error.sourceField], currentSpec);
          const errorFound = error.method(fieldValue, sourceValue) ? error.msg : null;
          if (errorFound) {
            updates = assocPath(getPathToField(sectionName, `${field.name}_error`), errorFound, updates);
          }
        }
      }
    }
    return updates;
  }

  /**
   * Some fields cause other fields to have preset values configured
   */
  private getPreFillChanges(currentSpec, sectionName, field, changes, updates) {
    const fieldName = field.name;
    switch (fieldName) {
      case 'bath':
        if (changes[fieldName] === 'TBC') {
          updates.mainBathroom = {
            ...updates.mainBathroom,
            bathMixer: 'hansaTBC',
            bathMixerAndSpoutPlacement: 'Centre (std)',
          };
        }
        break;

      case 'consultantName':
        const consultant = CONSULTANTS.find((c) => c.name === changes[fieldName]);
        if (consultant) {
          updates.contact_details = {
            ...updates.contact_details,
            consultantEmail: consultant.email,
            consultantPhone: consultant.phone,
          };
        }
        break;

      case 'projectManagerName':
        const manager = PROJECT_MANAGERS.find((c) => c.name === changes[fieldName]);
        if (manager) {
          updates.contact_details = {
            ...updates.contact_details,
            projectManagerEmail: manager.email,
            projectManagerPhone: manager.phone,
          };
        }
        break;

      case 'quantitySurveyorName':
        const quantitySurveyor = QUANTITY_SURVEYORS.find((c) => c.name === changes[fieldName]);
        if (quantitySurveyor) {
          updates.contact_details = {
            ...updates.contact_details,
            quantitySurveyorEmail: quantitySurveyor.email,
          };
        }

      case 'applianceSupplier':
        switch (changes[fieldName]) {
          case 'Noel Leeming':
            updates.appliances = {
              ...updates.appliances,
              oven: 'function7',
              dishwasher: 'westinghouse',
              hob: 'touch600',
            };
            break;
          case 'F&P Direct':
            updates.appliances = {
              ...updates.appliances,
              oven: 'fpBuiltInOven60',
              dishwasher: 'fpDishwasher15',
              hob: 'fpElectricCooktop60',
            };
            break;
          case 'Premier Appliances':
            updates.appliances = {
              ...updates.appliances,
              oven: 'boschSerie6Oven',
              dishwasher: 'boschSerie4BuiltUnderDishwasher',
              hob: 'boschSerie6Electric',
            };
            break;
        }
        break;
    }

    return updates;
  }

  private getCustomValueChanges(currentSpec, sectionName, field, changes, updates) {
    const isCustomBlockSection = sectionName.indexOf('^') > -1;

    let blockIndex: number;
    if (isCustomBlockSection) {
      sectionName = sectionName.split('^')[0];
      changes = updates[sectionName];
      blockIndex = keys(changes)[0];
      changes = changes[blockIndex];
    }
    const customKeys = keys(changes).filter((k) => k.includes('_custom'));

    if (customKeys.length > 0) {
      customKeys.forEach((customKey) => {
        if (changes[customKey]) {
          const customFieldName = customKey.replace('_custom', '');

          if (blockIndex) {
            updates.custom_value = {
              // see [NOTE1] in SpecDBService
              ...currentSpec.custom_value,
              [`${sectionName}^${blockIndex}`]: {
                [customFieldName]: {
                  value: changes[customKey],
                  dismissed: false,
                },
              },
            };
          } else {
            updates.custom_value = mergeDeepLeft(
              {
                [sectionName]: {
                  [customFieldName]: {
                    value: changes[customKey],
                    dismissed: false,
                  },
                },
                // see [NOTE1] in SpecDBService
              },
              currentSpec.custom_value || {}
            );
          }

          // remove this as it's not a real change we want to save to the spec
          if (blockIndex) {
            delete updates[sectionName][blockIndex][customKey];
          } else {
            delete updates[sectionName][customKey];
          }
        }
      });
    }

    return updates;
  }

  private getExtrasChanges(currentSpec, sectionName, field, changes, updates) {
    // find all extras related to this field
    // handle additional / duplicate sections => these use extras of standard section
    // e.g. ensuite_1 (duplicate) uses ensuite extras as source
    let extraSection = sectionName;
    if (extraSection.indexOf('^') > -1) {
      extraSection = extraSection.split('^')[0];
    } else if (extraSection.indexOf('_') > -1) {
      extraSection = extraSection.split('_')[0];
    }

    const extras = currentSpec.extras[extraSection];

    if (!extras) {
      return updates;
    }

    //if a target-removed field affect other field, then the other field should be removed as well
    const dependentFields = {
      quotePC: 'quote',
      quote: 'quotePC',
      lawnArea: 'lawnType',
      lawnType: 'lawnArea',
      numWindows: 'securityStays',
      securityStays: 'numWindows',
      doorColour: ' doorFrameColour',
      doorFrameColour: 'doorColour',
    };

    updates.extras = {
      [extraSection]: extras.filter((extra) => extra.field != field.name && extra.field != dependentFields[field.name]),
    };
    return updates;
  }

  private deleteEmptyObjects(currentSpec, sectionName, field, changes, updates) {
    if (isEmpty(updates[sectionName])) {
      delete updates[sectionName];
    }
    return updates;
  }

  private reIndexArray(array) {
    // ReIndex this line remove any empty values and ensures we have an array that has sequential keys
    // e.g. 0, 1, 2 and not 0, 2, 3
    return array.filter((val) => val !== undefined);
  }

  private sortSectionOrder(sortList, sectionsList) {
    const newSections = [];
    for (const section of sortList) {
      newSections.push(...[...sectionsList.filter((elem) => elem.name === section)]);
    }
    return newSections;
  }
}
