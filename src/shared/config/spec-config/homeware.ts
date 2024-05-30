export const homewareConfig = {
  id: 19,
  name: 'homeware',
  title: 'Wardrobes and shelving',
  canHide: true,
  canDuplicate: true,
  hasExtras: true,
  fields: [
    { name: 'homewarePmNote', display: 'PM Notes', type: 'textarea' },
    {
      name: 'wardrobe',
      display: 'Wardrobe System',
      items: ['Epoxy Coated Wire Ventilated System (std)', 'Upgraded Solid Timber to selected rooms', 'Other - Please Specify'],
      type: 'dropdown'
    },
    { name: 'quote', display: 'Quote', type: 'text' },
    { name: 'nook', display: 'Computer Nook', items: ['Included', 'Not included', 'Other - Please Specify'], type: 'dropdown' },
    { name: 'nookColour', display: 'Nook Colour', type: 'text' },
    { name: 'homeware_additional', display: 'Additional Info', type: 'textarea' }
  ]
};
