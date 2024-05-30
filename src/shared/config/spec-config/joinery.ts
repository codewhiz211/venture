import { axisImages, doorWindowColours, hardwareOfEntryDoorImages, latitudeImages, plasmaImages, styleImages } from './images';

export const joineryConfig = {
  id: 6,
  name: 'joinery',
  title: 'Joinery',
  canDuplicate: true,
  canHide: true,
  hasExtras: true,
  groupBySubtitle: true,
  fields: [
    { name: 'joineryPmNote', display: 'PM Notes', type: 'textarea' },
    { type: 'subtitle', text: 'Windows / Doors', name: 'windowDoorsSubTitle' },
    { name: 'windowsDoorsPmNote', display: 'PM Notes', type: 'textarea', canHide: 'windowDoorsSubTitle' },
    {
      name: 'height',
      display: 'Height',
      items: ['2.0m', '2.1m', '2.2m (Standard)', '2.4m', 'to soffit', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'windowDoorsSubTitle'
    },
    {
      name: 'windowColour',
      display: 'Window Colour',
      items: doorWindowColours,
      type: 'image-picker',
      extra: 'doorFrameColour',
      canHide: 'windowDoorsSubTitle'
    },
    {
      name: 'windowTint',
      display: 'Window Tint',
      items: ['0.15', 'None', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'windowDoorsSubTitle'
    },
    {
      name: 'hardwareColour',
      display: 'Hardware Colour',
      items: ['Black (Std)', 'Colour matched', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'windowDoorsSubTitle'
    },
    {
      name: 'securityStays',
      display: 'Security Stays',
      items: ['Yes', 'No', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'windowDoorsSubTitle'
    },
    { name: 'numWindows', display: 'Number Of Windows', type: 'number', extra: 'securityStays', canHide: 'windowDoorsSubTitle' },
    {
      type: 'subtitle-conditional',
      text: 'Entry Door (Aluminium, high density styrofoam insulated door)',
      name: 'entryDoorSubTitle',
      condition: {
        field: 'style',
        value: '!Other - Please Specify'
      }
    },
    {
      name: 'entryDoorAluminiumHighDensityStyrofoamInsulatedDoorPmNote',
      display: 'PM Notes',
      type: 'textarea',
      canHide: 'entryDoorSubTitle'
    },
    {
      type: 'subtitle-conditional',
      text: 'Entry Door',
      name: 'entryDoorOtherSubTitle',
      condition: {
        field: 'style',
        value: 'Other - Please Specify'
      },
      canHide: 'entryDoorSubTitle'
    },

    {
      name: 'style',
      display: 'Style',
      items: styleImages,
      type: 'image-picker',
      conditional: ['styleCodeLatitude', 'styleCodeAxis', 'styleCodePlasma', 'entryDoorSubTitle', 'entryDoorOtherSubTitle'],
      canHide: 'entryDoorSubTitle'
    },
    {
      name: 'styleCodeLatitude',
      display: 'Code',
      items: latitudeImages,
      type: 'image-picker',
      condition: {
        field: 'style',
        value: 'Latitude'
      },
      canHide: 'entryDoorSubTitle'
    },
    {
      name: 'styleCodeAxis',
      display: 'Code',
      items: axisImages,
      type: 'image-picker',
      condition: {
        field: 'style',
        value: 'Axis'
      },
      canHide: 'entryDoorSubTitle'
    },
    {
      name: 'styleCodePlasma',
      display: 'Code',
      items: plasmaImages,
      type: 'image-picker',
      condition: {
        field: 'style',
        value: 'Plasma'
      },
      canHide: 'entryDoorSubTitle'
    },
    {
      name: 'type',
      display: 'Type',
      items: ['TBC', 'Powder coat', 'Non Std P/C', 'Anodised / Frost', 'Wood Grain', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'entryDoorSubTitle'
    },
    {
      name: 'hardware',
      display: 'Hardware',
      items: hardwareOfEntryDoorImages,
      type: 'image-picker',
      canHide: 'entryDoorSubTitle'
    },
    { name: 'doorColour', display: 'Door Colour', items: doorWindowColours, type: 'image-picker', canHide: 'entryDoorSubTitle' },
    { name: 'doorFrameColour', display: 'Door Frame Colour', items: doorWindowColours, type: 'image-picker', canHide: 'entryDoorSubTitle' },
    { name: 'joinery_additional', display: 'Additional Info', type: 'textarea', canHide: 'entryDoorSubTitle' }
  ]
};

export default joineryConfig;
