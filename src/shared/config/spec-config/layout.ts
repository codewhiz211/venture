export const layoutConfig = {
  id: 3,
  name: 'layout',
  title: 'Layout',
  canHide: false,
  fields: [
    { name: 'layoutPmNote', display: 'PM Notes', type: 'textarea' },
    { name: 'bedrooms', display: 'Bedrooms', items: ['1', '2', '3', '4', '5', 'Other - Please Specify'], type: 'dropdown' },
    { name: 'bathrooms', display: 'Bathrooms', items: ['1', '2', '3', '4', 'Other - Please Specify'], type: 'dropdown' },
    { name: 'rakingCeiling', display: 'Raking Ceiling', items: ['Yes', 'No', 'Other - Please Specify'], type: 'dropdown' },
    { name: 'freeText', display: 'Raking Ceiling Area', type: 'text' },
    { name: 'studHeight', display: 'Stud Height', items: ['2.4', '2.55', '2.7', 'Raking', 'Other - Please Specify'], type: 'dropdown' },
    {
      name: 'garage',
      display: 'Garage Size',
      items: ['Single', 'Single + 1/2', 'Double', 'Triple', 'Other - Please Specify'],
      type: 'dropdown'
    },
    { name: 'layout_additional', display: 'Additional Info', type: 'textarea' }
  ],
  hasExtras: true
};
