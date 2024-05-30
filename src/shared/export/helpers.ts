import { includes, isEmpty, isNil, path, pickBy, without } from 'ramda';

import { blindsConfig } from '../config/spec-config/blinds';
import claddingConfig from '../config/spec-config/cladding';
import { ensuiteConfig } from '../config/spec-config/ensuite';
import { floorConfig } from '../config/spec-config/floor';
import interiorConfig from '../config/spec-config/interior';
import joineryConfig from '../config/spec-config/joinery';
import kitchenConfig from '../config/spec-config/kitchen';
import landscapeConfig from '../config/spec-config/landscape';
import mainBathroomConfig from '../config/spec-config/main-bathroom';
import { toiletConfig } from '../config/spec-config/toilet';

export const isAdditionalSection = (sectionKey) => sectionKey.includes('-additional');

export const isCustomSection = (sectionKey) => sectionKey.match(/^[a-z].*_\d+$/);

export const getCustomSections = (spec) => {
  const allKeys = Object.keys(spec);
  return allKeys.filter((key) => isCustomSection(key));
};

export const objectValuesToArray = (inputObject) => {
  const array = [];
  Object.keys(inputObject).forEach((key) => {
    array.push(inputObject[key]);
  });
  return array;
};

export const fieldHasValue = (fieldValue) => {
  if (fieldValue.value === '') {
    return false;
  }
  if (!isNil(fieldValue.value) || isEmpty(fieldValue.value)) {
    return true;
  }
  if (!isNil(fieldValue.hex) || isEmpty(fieldValue.hex)) {
    return true;
  }
  if (!isNil(fieldValue.url) || isEmpty(fieldValue.url)) {
    return true;
  }
  return false;
};

export const withoutHints = pickBy((val, key) => {
  return !key.includes('_hint');
});
export const withoutErrors = pickBy((val, key) => {
  return !key.includes('_error');
});

export const withoutEmpty = pickBy((val, key) => {
  return !isNil(val);
});

export const withoutEmptyGrouped = pickBy((val, key) => {
  switch (typeof val) {
    case 'string':
      if (val === '') {
        return false;
      }
      return true;
    case 'object':
      return fieldHasValue(val);
    default:
      return false;
  }
});

export const withoutIgnoredSections = pickBy((val, key) => {
  return !includes(key, [
    'blinds', // use blinds-additional
    'cladding', // use cladding-additional
    'custom_fields',
    'custom_value',
    'details',
    'disabled',
    'extras',
    'extras_manual',
    'extras_optional',
    'hiddenSections',
    'quote',
    'sort',
    'suggestions',
    'tiles-bathroom-additional', // not used anymore?
    'tiles-ensuite-additional', // not used anymore?
    'tiles-kitchen-additional', // not used anymore?
    'tiles-toilet-additional', // not used anymore?
    'uid',
  ]);
});

export const withoutIgnoredFields = (keys) =>
  without(['canHide', 'dummy', 'fields', 'hasExtras', 'name', 'id', 'order', 'title', 'fieldName'], keys);

export const isGroupedBySubtitle = (key) =>
  includes(key, ['mainBathroom', 'ensuite', 'interior', 'joinery', 'kitchen', 'landscape', 'toilet']);

export const getConfig = (sectionKey) => {
  switch (sectionKey) {
    case 'cladding-additional':
      return claddingConfig;

    case 'flooring-additional':
      return floorConfig;

    case 'blinds-additional':
      return blindsConfig;

    case 'mainBathroom':
      return mainBathroomConfig;

    case 'ensuite':
      return ensuiteConfig;

    case 'interior':
      return interiorConfig;

    case 'joinery':
      return joineryConfig;

    case 'kitchen':
      return kitchenConfig;

    case 'landscape':
      return landscapeConfig;

    case 'toilet':
      return toiletConfig;

    default:
      throw new Error(`unknown grouped section => ${sectionKey}. DId you forget to add this groups config to the switch?`);
  }
};

// * NOTE This uses the section CONFIG   .map(f => (f.name !== undefined ? f.name : `cannot find name for ${f.display} ${f.type}`))
export const getSectionGroups = (sectionConfig, customFields = {}) => {
  const groups = [];
  sectionConfig.fields.forEach((field) => {
    if ((field.type === 'subtitle' || field.type === 'subtitle-conditional') && field.hasOwnProperty('text')) {
      const customTitle = path([sectionConfig.name, field.name], customFields);
      const group = {
        group: groups.length,
        title: customTitle || field.text,
        name: field.name,
        fields: sectionConfig.fields.filter((f) => f.canHide === field.name).map((f) => f.name),
      };
      groups.push(group);
    }
  });
  return groups;
};
