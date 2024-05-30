import { exteriorColours, garageImages, pickColours } from './images';

const garageColours = exteriorColours.filter(
  pickColours([
    'tbc',
    'gullGrey',
    'permanentGreen',
    'flaxPod',
    'lignite',
    'newDenimBlue',
    'thunderGrey',
    'sandstoneGrey',
    'scoria',
    'karaka',
    'mistGreen',
    'ironsand',
    'desertSand',
    'greyFriars',
    'titania',
    'ebony',
    'windsorGrey',
    'other'
  ])
);

export const garageConfig = {
  id: 7,
  name: 'garage',
  title: 'Garage',
  canDuplicate: true,
  canHide: true,
  fields: [
    { name: 'garagePmNote', display: 'PM Notes', type: 'textarea' },
    { name: 'garageDoor', display: 'Garage Door', items: garageImages, type: 'image-picker', hint: true },
    { name: 'garageColour', display: 'Colour', items: garageColours, type: 'image-picker' },
    {
      name: 'garageDoorInsulation',
      display: 'GDoor Insulation',
      items: ['No', 'Single', 'Single + Half', 'Double', 'Other - Please Specify'],
      type: 'dropdown'
    },
    { name: 'garageDoorJamb', display: 'GDoor Jamb', items: ['Aluminium', 'Timber', 'Other - Please Specify'], type: 'dropdown' },
    { name: 'garageDoorJambColour', display: 'Jamb Colour', type: 'text' },
    { name: 'atticLadder', display: 'Attic Ladder', items: ['Yes', 'No', 'Other - Please Specify'], type: 'dropdown', hint: true },
    { name: 'garage_additional', display: 'Additional Info', type: 'textarea' }
  ],
  hasExtras: true
};
export default garageConfig;
