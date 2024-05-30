import { clothesLineImages } from './images';

export const landscapeConfig = {
  id: 20,
  name: 'landscape',
  title: 'Landscape',
  canDuplicate: true,
  canHide: true,
  groupBySubtitle: true,
  hasExtras: true,
  fields: [
    { name: 'landscapePmNote', display: 'PM Notes', type: 'textarea' },
    { type: 'subtitle', text: 'Fences Full Share', name: 'fencesFullShareSubTitle' },
    { name: 'fencesFullSharePmNote', display: 'PM Notes', type: 'textarea', canHide: 'fencesFullShareSubTitle' },
    { name: 'fullFriendly', display: 'Friendly Neighbour Height', type: 'text', canHide: 'fencesFullShareSubTitle' },
    { name: 'fullAllowance', display: 'Allowance', type: 'text', canHide: 'fencesFullShareSubTitle' },
    { name: 'fullLm', display: 'LM', type: 'text', canHide: 'fencesFullShareSubTitle' },
    { name: 'landscape_fences_full_additional', display: 'Additional Info', type: 'textarea', canHide: 'fencesFullShareSubTitle' },
    { type: 'subtitle', text: 'Fences Half Share', name: 'fencesHalfShareSubTitle' },
    { name: 'fencesHalfSharePmNote', display: 'PM Notes', type: 'textarea', canHide: 'fencesHalfShareSubTitle' },
    { name: 'halfFriendly', display: 'Friendly Neighbour Height', type: 'text', canHide: 'fencesHalfShareSubTitle' },
    { name: 'halfAllowance', display: 'Allowance', type: 'text', canHide: 'fencesHalfShareSubTitle' },
    { name: 'halfLm', display: 'LM', type: 'text', canHide: 'fencesHalfShareSubTitle' },
    { name: 'landscape_fences_additional', display: 'Additional Info', type: 'textarea', canHide: 'fencesHalfShareSubTitle' },
    { type: 'subtitle', text: 'Side Fence Gate', name: 'sideFenceGate' },
    { name: 'sideFenceGatePmNote', display: 'PM Notes', type: 'textarea', canHide: 'sideFenceGate' },
    { name: 'sideFriendly', display: 'Friendly Neighbour Height', type: 'text', canHide: 'sideFenceGate' },
    { name: 'sideAllowance', display: 'Allowance', type: 'text', canHide: 'sideFenceGate' },
    { name: 'sideLm', display: 'LM', type: 'text', canHide: 'sideFenceGate' },
    { name: 'landscape_side_additional', display: 'Additional Info', type: 'textarea', canHide: 'sideFenceGate' },
    { type: 'subtitle', text: 'Deck', name: 'deckSubtitle' },
    { name: 'deckPmNote', display: 'PM Notes', type: 'textarea', canHide: 'deckSubtitle' },
    {
      name: 'deckingType',
      display: 'Decking Type',
      items: ['Pine 90x32', 'Pine 140x32', 'Kwila 90x18', 'Kwila 140x21', 'N/A', 'Other - Please Specify'],
      type: 'dropdown',
      conditional: ['deckingArea', 'landscape_deck_additional'],
      canHide: 'deckSubtitle'
    },
    {
      name: 'deckingArea',
      display: 'Area',
      type: 'number-conditional',
      suffix: 'SQM',
      condition: {
        field: 'deckingType',
        value: '!N/A'
      },
      canHide: 'deckSubtitle'
    },
    {
      name: 'landscape_deck_additional',
      display: 'Additional Info',
      type: 'textarea-conditional',
      condition: {
        field: 'deckingType',
        value: '!N/A'
      },
      canHide: 'deckSubtitle'
    },
    { type: 'subtitle', text: 'Driveway', name: 'drivewaySubTitle' },
    { name: 'drivewayPmNote', display: 'PM Notes', type: 'textarea', canHide: 'drivewaySubTitle' },
    {
      name: 'drivewayType',
      display: 'Driveway Type',
      items: ['Standard', '1/2 Dose Black', 'Exposed Agg 1/2 Dose Blk', 'Paved', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'drivewaySubTitle'
    },
    { name: 'drivewayArea', display: 'Area', type: 'number', suffix: 'SQM', canHide: 'drivewaySubTitle' },
    {
      name: 'vehicleCrossing',
      display: 'Vehicle Crossing',
      items: ['Std Concrete', 'Exposed Aggregate', 'Pre Existing', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'drivewaySubTitle'
    },
    {
      name: 'vehicleCrossingSize',
      display: 'Size',
      items: ['Single', 'Double', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'drivewaySubTitle'
    },
    { name: 'landscape_side_driveway', display: 'Additional Info', type: 'textarea', canHide: 'drivewaySubTitle' },
    { type: 'subtitle', text: 'Lawn', name: 'lawnSubTitle' },
    { name: 'lawnPmNote', display: 'PM Notes', type: 'textarea', canHide: 'lawnSubTitle' },
    {
      name: 'lawnType',
      display: 'Lawn Type',
      items: [
        'No Landscaping',
        'Prepped with Subdivision topsoil and Hydroseeded',
        'Prepped with Subdivision topsoil and Ready lawned',
        'Other - Please Specify'
      ],
      type: 'dropdown',
      canHide: 'lawnSubTitle'
    },
    { name: 'lawnArea', display: 'Area', type: 'number', suffix: 'SQM', extra: 'lawnType', canHide: 'lawnSubTitle' },
    { name: 'landscape_lawn_driveway', display: 'Additional Info', type: 'textarea', canHide: 'lawnSubTitle' },
    { type: 'subtitle', text: 'Other', name: 'otherSubTitle' },
    { name: 'otherPmNote', display: 'PM Notes', type: 'textarea', canHide: 'otherSubTitle' },
    {
      name: 'letterbox',
      display: 'Letterbox',
      items: ['Std', 'Brick', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'otherSubTitle'
    },
    { name: 'clothesLine', display: 'Clothes Line', items: clothesLineImages, type: 'image-picker', canHide: 'otherSubTitle' },
    {
      name: 'exteriorHoseTaps',
      display: 'Exterior Hose Taps',
      items: ['0', '1', '2 (Std)', '3', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'otherSubTitle'
    },
    { name: 'landscape_additional', display: 'Additional Info', type: 'textarea', canHide: 'otherSubTitle' }
  ]
};
export default landscapeConfig;
