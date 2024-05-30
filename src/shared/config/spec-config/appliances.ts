import {
  dishwasherImages,
  historyDishwasherImages,
  historyOvenImage,
  hobHistoryImages,
  hobImages,
  ovenImages,
  rangehoodImages
} from './images';

export const appliancesConfig = {
  id: 11,
  name: 'appliances',
  title: 'Appliances',
  canDuplicate: true,
  canHide: true,
  hasExtras: true,
  fields: [
    { name: 'appliancesPmNote', display: 'PM Notes', type: 'textarea' },
    {
      name: 'applianceSupplier',
      display: 'Appliance Supplier',
      items: ['Noel Leeming', 'Premier Appliances', 'F&P Direct', 'Other - Please Specify'],
      type: 'dropdown'
    },
    { name: 'quoteNumber', display: 'Quote #', type: 'text' },
    { name: 'oven', display: 'Oven', items: ovenImages, historyItems: historyOvenImage, type: 'image-picker' },
    { name: 'dishwasher', display: 'Dishwasher', items: dishwasherImages, historyItems: historyDishwasherImages, type: 'image-picker' },
    { name: 'hob', display: 'Hob', items: hobImages, type: 'image-picker', historyItems: hobHistoryImages },
    { name: 'rangehood', display: 'Rangehood', items: rangehoodImages, type: 'image-picker' },
    { name: 'wasteDisposal', display: 'Waste Disposal', items: ['Yes', 'No', 'Other - Please Specify'], type: 'dropdown' },
    {
      name: 'wasteDisposalAirswitchColour',
      display: 'Waste Disposal Airswitch Colour',
      type: 'text-conditional',
      condition: {
        field: 'wasteDisposal',
        value: 'Yes'
      }
    },
    { name: 'fridgeSizeModel', display: 'Fridge Size & Model', type: 'text' },
    { name: 'waterToFridge', display: 'Water To Fridge', items: ['Yes', 'No', 'Other - Please Specify'], type: 'dropdown', hint: true },
    { name: 'appliances_additional', display: 'Additional Info', type: 'textarea' }
  ]
};
export default appliancesConfig;
