import { cylinderImages, historyLaundryImages, laundryImages } from './images';

export const laundyConfig = {
  id: 12,
  name: 'laundry',
  title: 'Laundry & Hot Water Cylinder',
  canDuplicate: true,
  canHide: true,
  fields: [
    { name: 'laundryPmNote', display: 'PM Notes', type: 'textarea' },
    { name: 'cylinder', display: 'Cylinder', items: cylinderImages, type: 'image-picker' },
    { name: 'laundryTub', display: 'Laundry Tub', items: laundryImages, historyItems: historyLaundryImages, type: 'image-picker' },
    {
      name: 'laundryTubSupplier',
      display: 'Laundry Tub Supplier',
      type: 'text-conditional',
      condition: {
        field: 'laundryTub',
        value: 'custom'
      }
    },
    {
      name: 'laundryTubPC',
      display: 'Laundry Tub P.C.',
      type: 'text-conditional',
      condition: {
        field: 'laundryTub',
        value: 'custom'
      }
    },
    {
      name: 'laundryTubQuote',
      display: 'Laundry Tub Quote',
      type: 'text-conditional',
      condition: {
        field: 'laundryTub',
        value: 'custom'
      }
    },
    {
      name: 'versionNoDate',
      display: 'Version No. & Date',
      type: 'text-conditional',
      condition: {
        field: 'laundryTub',
        value: 'custom'
      }
    },
    { name: 'laundry_additional', display: 'Additional Info', type: 'textarea' }
  ],
  hasExtras: true
};
