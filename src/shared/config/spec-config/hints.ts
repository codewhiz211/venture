export const hintsConfig = [
  { field: 'garageDoor', value: 'futuraSmooth', text: 'Horizontal Ribbed profile - 3x deep ribs & 2x fine "pencil" ribs per panel.' },
  { field: 'garageDoor', value: 'futuraWoodGrain', text: 'Horizontal Ribbed profile - 3x deep ribs & 2x fine "pencil" ribs per panel.' },
  { field: 'garageDoor', value: 'milanoSmooth', text: 'Horizontal Ribbed profile - 3x fine "pencil" ribs per panel.' },
  { field: 'garageDoor', value: 'milanoWoodGrain', text: 'Horizontal Ribbed profile - 3x fine "pencil" ribs per panel.' },
  { field: 'garageDoor', value: 'valero', text: 'Flat Finish profile - Roll-formed flat profile.' },

  { field: 'houseSize', value: 'ALWAYS', text: 'SQM over frame' },

  { field: 'mortarColour', value: 'ALWAYS', text: 'Mortar to match brick colour additional $400 (POA)' },
  { field: 'atticLadder', value: 'Yes', text: 'Includes 2 x kopine floor sheets' },
  { field: 'waterToFridge', value: 'Yes', text: 'Does not include install of filter' },
  {
    field: 'lrv1',
    sourceField: 'claddingType',
    value: 'Shadowclad 300 Batten',
    text: 'No dark colours should be selected when using Shadowclad 300 Batten'
  },
  {
    field: 'lrv2',
    sourceField: 'claddingType',
    value: 'Shadowclad 300 Batten',
    text: 'No dark colours should be selected when using Shadowclad 300 Batten'
  },
  {
    field: 'lowestRoofPitch',
    value: 'value && value < 9',
    valExpression: true,
    text: 'Plumbdeck profile required to areas under 9 degrees'
  },
  {
    field: 'fasciaColour',
    text: 'NOTE: Fascia Colour does not match Roof Colour',
    compareWith: 'roofColour'
  },
  {
    field: 'gutterColour',
    text: 'NOTE: Gutter Colour does not match Roof Colour',
    compareWith: 'roofColour'
  },
  { field: 'downpipesColour1', value: 'ALWAYS', text: 'Downpipe colour 1 is for Brick' },
  { field: 'downpipesColour2', value: 'ALWAYS', text: 'Downpipe colour 2 is for weatherboard' },
];
