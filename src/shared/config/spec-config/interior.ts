import { hardwareImages, routePatternImages } from './images';

export const interiorConfig = {
  id: 9,
  name: 'interior',
  title: 'Interior',
  canDuplicate: true,
  canHide: true,
  hasExtras: true,
  groupBySubtitle: true,
  fields: [
    { name: 'interiorPmNote', display: 'PM Notes', type: 'textarea' },
    {
      type: 'subtitle',
      text: 'Interior Doors (Hallmark Hollow Core Door on 3mm Skin with any route pattern)',
      name: 'interiorDoorsSubTitle'
    },
    {
      name: 'interiorDoorsHallmarkHollowCoreDoorOn3mmSkinWithAnyRoutePatternPmNote',
      display: 'PM Notes',
      type: 'textarea',
      canHide: 'interiorDoorsSubTitle'
    },
    {
      name: 'doorHeight',
      display: 'Door Height',
      items: ['Std 1980mm', '2.2m', '2.4m', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'interiorDoorsSubTitle'
    },
    { name: 'routePattern', display: 'Route Pattern', items: routePatternImages, type: 'image-picker', canHide: 'interiorDoorsSubTitle' },
    {
      name: 'architrave',
      display: 'Architrave',
      items: ['40/10 S/bev', '40/18 S/bev', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'interiorDoorsSubTitle'
    },
    {
      name: 'wetAreaFloor',
      display: 'Wet Area Floor',
      items: ['Tile', 'Vinyl', 'Polish', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'interiorDoorsSubTitle'
    },
    {
      name: 'wetAreaArchitrave',
      display: 'Wet Area Architrave',
      items: ['40/10 S/bev', '40/18 S/bev', 'Other - Please Specify'],
      type: 'dropdown',
      condition: {
        field: 'wetAreaFloor',
        value: 'Tile'
      },
      canHide: 'interiorDoorsSubTitle'
    },
    { type: 'subtitle', text: 'Interior Handles', name: 'interiorHandlesSubtitle' },
    { name: 'interiorHandlesPmNote', display: 'PM Notes', type: 'textarea', canHide: 'interiorHandlesSubtitle' },
    { name: 'hardware', display: 'Hardware', items: hardwareImages, type: 'image-picker', canHide: 'interiorHandlesSubtitle' },
    {
      name: 'hinges',
      display: 'Hinges',
      items: ['Standard', 'Graphite', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'interiorHandlesSubtitle'
    },
    {
      type: 'subtitle',
      text: 'Interior Colours (Max 3 colours - (Level 4 plaster and paint finish) Feature walls Level 5 extra cost)',
      name: 'interiorColoursSubTitle'
    },
    {
      name: 'interiorColoursMax3ColoursLevel4PlasterAndPaintFinishFeatureWallsLevel5ExtraCostPmNote',
      display: 'PM Notes',
      type: 'textarea',
      canHide: 'interiorColoursSubTitle'
    },
    {
      name: 'architraves',
      display: 'Architraves',
      items: ['40mm S/Bev', '60mm S/Bev', '40mm B/nose', '60mm B/nose', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'interiorColoursSubTitle'
    },
    { name: 'architravesColour', display: 'Architraves Colour', type: 'text', canHide: 'interiorColoursSubTitle' },
    {
      name: 'skirtings',
      display: 'Skirtings',
      items: ['60mm S/Bev', '90mm S/Bev', '60mm B/nose', '90mm B/nose', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'interiorColoursSubTitle'
    },
    { name: 'skirtingsColour', display: 'Skirtings Colour', type: 'text', canHide: 'interiorColoursSubTitle' },
    {
      name: 'ceiling',
      display: 'Ceiling',
      items: ['40mm Timber', 'Square Stop', '55mm Gib Cove POA', '75mm Gib Cove POA', '90mm Gib Cove POA', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'interiorColoursSubTitle'
    },
    { name: 'ceilingColour', display: 'Ceiling Colour', type: 'text', canHide: 'interiorColoursSubTitle' },
    { name: 'doorsColour', display: 'Doors Colour', type: 'text', canHide: 'interiorColoursSubTitle' },
    { name: 'wallColour1', display: 'Wall Colour 1', type: 'text', canHide: 'interiorColoursSubTitle' },
    { name: 'wallColour2', display: 'Wall Colour 2', type: 'text', canHide: 'interiorColoursSubTitle' },
    { name: 'wallColour3', display: 'Wall Colour 3', type: 'text', canHide: 'interiorColoursSubTitle' },
    { name: 'wallInfo', display: 'Wall Info', type: 'textarea', fullWidth: true, canHide: 'interiorColoursSubTitle' },
    {
      type: 'note',
      text: 'NOTE: Dark colours on feature walls require level 5 plastering which will incur additional cost.',
      canHide: 'interiorColoursSubTitle'
    },
    { name: 'featureWall1', display: 'Feature Wall 1', type: 'text', canHide: 'interiorColoursSubTitle' },
    { name: 'featureWall1Colour', display: 'Colour', type: 'text', canHide: 'interiorColoursSubTitle' },
    { name: 'featureWall2', display: 'Feature Wall 2', type: 'text', canHide: 'interiorColoursSubTitle' },
    { name: 'featureWall2Colour', display: 'Colour', type: 'text', canHide: 'interiorColoursSubTitle' },
    { name: 'featureWallInfo', display: 'Feature Wall Info', type: 'textarea', fullWidth: true, canHide: 'interiorColoursSubTitle' }
  ]
};

export default interiorConfig;
