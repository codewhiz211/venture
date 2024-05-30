import { mergeDeepRight } from 'ramda';

/**
 * The default spec will have empty objects for some fields
 * THis method can the be used to merge in state for specific test scenarios.
 * @param testData
 */
export const getTestSpec = (SPEC, testData = {}) => {
  return mergeDeepRight(SPEC, testData);
};

export const ORDER_LIST = [
  'section_details',
  'planning',
  'layout',
  'exterior',
  'cladding',
  'joinery',
  'garage',
  'insulation',
  'interior',
  'kitchen',
  'appliances',
  'laundry',
  'mainBathroom',
  'toilet',
  'ensuite',
  'floor',
  'electrical',
  'blinds',
  'homeware',
  'landscape'
];
