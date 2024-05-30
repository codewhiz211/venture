const blindTypes = ['Roller - TBC', 'Roller - Sunshade', 'Roller - Blockout', 'Venetian = (POA)', 'Other - Please Specify'];

export const blindsConfig = {
  id: 18,
  name: 'blinds',
  title: 'Blinds',
  dontPrintTitle: false, // so that header is above pm notes
  canDuplicate: true,
  canHide: true,
  hasExtras: true,
  hasCustom: true,
  fields: [
    { name: 'blindsPmNote', display: 'PM Notes', type: 'textarea' },
    {
      type: 'note',
      text: 'Throughout house excluding Bathrooms, Stairways, voids and Garage (Split blinds under 3m not included in contract price)'
    },
    {
      name: 'blinds-additional',
      display: 'Blinds Groups',
      type: 'custom-blocks',
      default: { blinds: '' },
      blockFields: [
        { name: 'blinds', display: 'Blinds', items: blindTypes, type: 'dropdown', order: 1 },
        { name: 'blindColour', display: 'Blind Colour', type: 'text', order: 2 },
        { name: 'barColour', display: 'Bar Colour', type: 'text', order: 3 },
        { name: 'chainColour', display: 'Chain Colour', type: 'text', order: 4 },
        { name: 'splits', display: 'Splits > 3m', items: ['0', '1', '2', '3', 'Other - Please Specify'], type: 'dropdown', order: 5 },
        { name: 'areaDetails', display: 'Area & Details', type: 'textarea', fullWidth: true, order: 6 }
      ]
    }
  ]
};
