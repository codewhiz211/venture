import { exteriorColours, roofImages } from './images';

export const exteriorConfig = {
  id: 4,
  name: 'exterior',
  title: 'Exterior',
  canDuplicate: true,
  canHide: true,
  groupBySubtitle: true,
  fields: [
    { name: 'exteriorPmNote', display: 'PM Notes', type: 'textarea' },
    {
      type: 'subtitle',
      text: 'Roof',
      name: 'roofSubTitle'
    },
    {
      name: 'roofPmNote',
      display: 'PM Notes',
      type: 'textarea',
      canHide: 'roofSubTitle'
    },
    { name: 'roofType', display: 'Roof Type', items: roofImages, type: 'image-picker', canHide: 'roofSubTitle' },
    {
      name: 'roofColour',
      display: 'Roof Colour',
      items: exteriorColours,
      type: 'image-picker',
      updateHints: ['fasciaColour', 'gutterColour'],
      canHide: 'roofSubTitle'
    },
    { name: 'roofPitch', display: 'Roof Pitch', type: 'number', suffix: 'deg', canHide: 'roofSubTitle' },
    { name: 'lowestRoofPitch', display: 'Lowest Roof Pitch', type: 'number', hint: true, warning: true, canHide: 'roofSubTitle' },
    {
      type: 'subtitle',
      text: 'Fascia',
      name: 'fasciaSubTitle'
    },
    {
      name: 'fasciaPmNote',
      display: 'PM Notes',
      type: 'textarea',
      canHide: 'fasciaSubTitle'
    },
    {
      name: 'fascia',
      display: 'Fascia',
      items: ['Colour Steel', 'Timber', 'Cedar', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'fasciaSubTitle'
    },
    {
      name: 'fasciaColour',
      display: 'Fascia Colour',
      items: exteriorColours,
      type: 'image-picker',
      hint: true,
      warning: true,
      canHide: 'fasciaSubTitle'
    },
    {
      type: 'subtitle',
      text: 'Gutter',
      name: 'gutterSubTitle'
    },
    {
      name: 'gutterPmNote',
      display: 'PM Notes',
      type: 'textarea',
      canHide: 'gutterSubTitle'
    },
    {
      name: 'gutter',
      display: 'Gutter',
      items: ['C/Steel 1/4 Rnd', 'Box', 'Marley - please specify', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'gutterSubTitle'
    },
    {
      name: 'gutterColour',
      display: 'Gutter Colour',
      items: exteriorColours,
      type: 'image-picker',
      hint: true,
      warning: true,
      canHide: 'gutterSubTitle'
    },
    {
      type: 'subtitle',
      text: 'Downpipes',
      name: 'downpipesSubTitle'
    },
    {
      name: 'downpipesPmNote',
      display: 'PM Notes',
      type: 'textarea',
      canHide: 'downpipesSubTitle'
    },
    {
      name: 'downpipes',
      display: 'Downpipes',
      items: ['80mm Rnd', 'Square', 'Paint Finish', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'downpipesSubTitle'
    },

    {
      name: 'downpipesColour1',
      display: 'Downpipe Colour 1',
      items: exteriorColours,
      type: 'image-picker',
      hint: true,
      canHide: 'downpipesSubTitle'
    },
    {
      name: 'downpipesColour2',
      display: 'Downpipe Colour 2',
      items: exteriorColours,
      type: 'image-picker',
      hint: true,
      canHide: 'downpipesSubTitle'
    },
    {
      type: 'subtitle',
      text: 'Sofit',
      name: 'sofitSubTitle'
    },
    {
      name: 'sofitPmNote',
      display: 'PM Notes',
      type: 'textarea',
      canHide: 'sofitSubTitle'
    },
    { name: 'soffit', display: 'Soffit', items: ['4.5mm Hardie', 'Other - Please Specify'], type: 'dropdown', canHide: 'sofitSubTitle' },
    {
      name: 'soffitColour',
      display: 'Soffit Colour',
      items: ['Black', 'White', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'sofitSubTitle'
    },
    { name: 'exterior_additional', display: 'Additional Info', type: 'textarea' }
  ],
  hasExtras: true
};
export default exteriorConfig;
