import { benchtopMixerImages } from './images';

const benchtops = [
  'Engineered Stone 20mm',
  'Engineered Stone 30mm',
  'Engineered Stone 40mm',
  'Enginered Stone 50mm',
  'Other - Please Specify'
];
const sink = ['Standard Stainless Steel', 'Black Granite', 'White Granite', 'Other - Please specify'];
const kitchenCabinets = ['Gloss finish', 'Naturale finish', 'Other - Please Specify'];
const benchtopsColor = [
  'TBC',
  'Blanco Maple',
  'Blanco Matrix',
  'Gris Expo',
  'Negro Tebas',
  'Coral Stone',
  'Glisten White',
  'Grey Storm',
  'New Shell',
  'Sardinia',
  'Taupe',
  'White Galaxy',
  'White Pearl',
  'Stellar Black',
  'Stellar Grey',
  'Stellar White',
  'Absolute White',
  'Carrera Quartz',
  'Elba Quartz',
  'Electric Grey',
  'Gioia Quartz',
  'Grigio Mist',
  'Marquina Quartz',
  'Mountain Mist',
  'Neve Quartz',
  'New Fossil',
  'New Lily White',
  'Polaris',
  'Riverbed',
  'Stat Venato',
  'Tiger Beige',
  'Titanium Dark Grey',
  'Titanium Light Grey',
  'Platinum White',
  'Calacatta Classic',
  'Carla Grigio',
  'Cala Quartz',
  'Stat Quartz',
  'Other - Please Specify'
];
const splashbacks = [
  'Tiled (STD)',
  'Tiled (Mosaic)',
  'Tiled (Herringbone)',
  'Tiled - other',
  'Glass (Std)',
  'Glass (full wall)',
  'Other - Please Specify'
];
const splashbackWidths = ['STD Cabinet to Cabinet', 'Width of Hob', 'Cabinet to Window', 'Non Std', 'Other - Please Specify'];
const splashbackHeights = ['STD (Up to Range hood)', 'To the ceiling', 'Other - Please Specify'];

export const kitchenConfig = {
  id: 10,
  name: 'kitchen',
  title: 'Kitchen',
  canDuplicate: true,
  canHide: true,
  hasExtras: true,
  groupBySubtitle: true,
  fields: [
    { name: 'kitchenPmNote', display: 'PM Notes', type: 'textarea' },
    { type: 'subtitle', text: '' } /* to create a group for the items below */,
    { name: 'supplier', display: 'Kitchen Supplier', type: 'text' },
    { name: 'quotePC', display: 'Kitchen P.C.', type: 'number' },
    { name: 'quote', display: 'Kitchen Quote', type: 'number' },
    { name: 'quoteDateNo', display: 'Version No. & Date', type: 'text' },
    { name: 'benchtop', display: 'Benchtop', items: benchtops, type: 'dropdown' },
    { name: 'benchtopColour', display: 'Benchtop Colour', items: benchtopsColor, type: 'dropdown' },
    { name: 'kitchenMixer', display: 'Kitchen Mixer', items: benchtopMixerImages, type: 'image-picker' },
    { name: 'sink', display: 'Sink', items: sink, type: 'dropdown' },
    { name: 'kitchenCabinets', display: 'Kitchen Cabinets', items: kitchenCabinets, type: 'dropdown' },
    { name: 'cabinetColour', display: 'Cabinet Colour', type: 'text' },
    { name: 'canintHandles', display: 'Cabinet Handles', type: 'text' },
    { name: 'featurePanel', display: 'Feature Panel', type: 'text' },
    { name: 'panelLocation', display: 'Panel Location', type: 'text' },
    {
      name: 'splashback',
      display: 'Splashback',
      items: splashbacks,
      type: 'dropdown',
      conditional: [
        'tileTypeStd',
        'tileColourStd',
        'tileGroutStd',
        'tileLayoutStd',
        'splashbackWidthStd',
        'splashbackHeightStd',
        'additionalInfoStd',
        'tileTypeMosaic',
        'tileColourMosaic',
        'tileGroutMosaic',
        'tileLayoutMosaic',
        'splashbackWidthMosaic',
        'splashbackHeightMosaic',
        'additionalInfoMosaic',
        'tileTypeHerringbone',
        'tileColourHerringbone',
        'tileGroutHerringbone',
        'tileLayoutHerringbone',
        'splashbackWidthHerringbone',
        'splashbackHeightHerringbone',
        'additionalInfoHerringbone'
      ]
    },
    // KITCHEN - SPLASHBACK
    {
      type: 'subtitle-conditional',
      text: 'Splashback Tiles',
      name: 'splashbackTilesSubTitle',
      condition: {
        section: 'kitchen',
        field: 'splashback',
        value: 'Tiled (STD),Tiled (Mosaic),Tiled (Herringbone),Tiled - other'
      }
    },
    {
      name: 'tileTypeStd',
      display: 'Tile Type',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'splashback',
        value: 'Tiled (STD),Tiled (Mosaic),Tiled (Herringbone),Tiled - other'
      },
      canHide: 'splashbackTilesSubTitle'
    },
    {
      name: 'tileColourStd',
      display: 'Tile Colour',
      type: 'text-conditional',
      condition: {
        field: 'splashback',
        value: 'Tiled (STD),Tiled (Mosaic),Tiled (Herringbone),Tiled - other'
      },
      canHide: 'splashbackTilesSubTitle'
    },
    {
      name: 'tileGroutStd',
      display: 'Grout Colour',
      type: 'text-conditional',
      condition: {
        field: 'splashback',
        value: 'Tiled (STD),Tiled (Mosaic),Tiled (Herringbone),Tiled - other'
      },
      canHide: 'splashbackTilesSubTitle'
    },
    {
      name: 'tileLayoutStd',
      display: 'Tile Layout',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'splashback',
        value: 'Tiled (STD),Tiled (Mosaic),Tiled (Herringbone),Tiled - other'
      },
      canHide: 'splashbackTilesSubTitle'
    },
    {
      name: 'tileLayoutStd',
      display: 'Tile Layout',
      type: 'dropdown',
      items: ['Stacked', 'Bricklayed', 'Other - Please specify'],
      condition: {
        specVersion: '2.01+',
        field: 'splashback',
        value: 'Tiled (STD),Tiled (Mosaic),Tiled (Herringbone),Tiled - other'
      },
      canHide: 'splashbackTilesSubTitle'
    },
    {
      name: 'splashbackWidthStd',
      display: 'Splashback Width',
      items: splashbackWidths,
      type: 'dropdown',
      condition: {
        field: 'splashback',
        value: 'Tiled (STD),Tiled (Mosaic),Tiled (Herringbone),Tiled - other'
      },
      canHide: 'splashbackTilesSubTitle'
    },
    {
      name: 'splashbackHeightStd',
      display: 'Splashback Height',
      items: splashbackHeights,
      type: 'dropdown',
      condition: {
        field: 'splashback',
        value: 'Tiled (STD),Tiled (Mosaic),Tiled (Herringbone),Tiled - other'
      },
      canHide: 'splashbackTilesSubTitle'
    },
    {
      name: 'additionalInfoStd',
      display: 'Additional Tile Info',
      fullwidth: true,
      type: 'textarea-conditional',
      condition: {
        field: 'splashback',
        value: 'Tiled (STD),Tiled (Mosaic),Tiled (Herringbone),Tiled - other'
      },
      canHide: 'splashbackTilesSubTitle'
    },
    { type: 'subtitle' },
    { name: 'kitchen_additional', display: 'Additional Info', type: 'textarea', canHide: 'splashbackTilesSubTitle' }
  ]
};
export default kitchenConfig;
