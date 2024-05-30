export const sectionDetailsConfig = {
  id: 1,
  name: 'section_details',
  title: 'Section Details',
  canHide: false,
  fields: [
    { name: 'scheme', display: 'Scheme', type: 'text' },
    { name: 'subdivision', display: 'Subdivision', type: 'text' },
    { name: 'section_detailsPmNote', display: 'PM Notes', type: 'textarea' },
    { name: 'lot', display: 'Lot Number', type: 'text' },
    { name: 'houseSize', display: 'House Size', type: 'text', suffix: 'SQM', hint: true },
    { name: 'sectionSize', display: 'Section Size', type: 'text', suffix: 'SQM' },
    { name: 'consentNumber', display: 'Consent Number', type: 'text', required: true },
    { name: 'dbCode', display: 'DB Code', type: 'text' },
    { name: 'address', display: 'Street Address', type: 'text' },
  ],
  expandLastField: true,
};
