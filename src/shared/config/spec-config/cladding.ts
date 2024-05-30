const brickTypes = ['TBC', 'Coal', 'Ice', 'Ironsands', 'Limestone', 'Mist', 'Pewter', 'Mocha', 'Tea', 'Wheat', 'Other - Please Specify'];
const claddingTypes = [
  'Brick',
  'The Brickery Origins Series clay brick',
  'Bowers Brick',
  'Bagged Brick',
  'Painted Brick',
  'Plaster over brick',
  'JH Linea Weatherboard 150mm Cover',
  'JH Linea Weatherboard 180mm Cover',
  'Timber Weatherboard 150mm Cover',
  'Timber Vertical Weatherboard 150mm Cover',
  'JH Oblique Vertical 200mm Cover',
  'JH Oblique Vertical 300mm Cover',
  'JH Stria Horizontal 400mm Cover',
  'JH Stria Vertical 400mm Cover',
  'Shadowclad 300 Batten',
  'Rockcote plaster',
  'Other - Please Specify'
];

export const claddingConfig = {
  id: 5,
  name: 'cladding',
  title: 'Cladding',
  dontPrintTitle: false, // so that header is above pm notes
  canDuplicate: true,
  canHide: true,
  hasExtras: true,
  hasCustom: true,
  fields: [
    { name: 'claddingPmNote', display: 'PM Notes', type: 'textarea' },
    { type: 'note', text: 'Note: dark colours may fade over time use of Resene cool colours can reduce fading' },
    {
      name: 'cladding-additional',
      display: 'Cladding Groups',
      type: 'custom-blocks',
      default: { claddingType: 'Brick' },
      blockFields: [
        {
          name: 'claddingType',
          display: 'Cladding Type',
          items: claddingTypes,
          type: 'dropdown',
          conditional: [
            'area',
            'colour1',
            'lrv1',
            'colour2',
            'lrv2',
            'brickColour1',
            'brickColour1Area',
            'brickColour2',
            'brickColour2Area',
            'mortarColour',
            'brickSeal',
            'additionalInfo',
            'other'
          ],
          order: 0,
          errors: true
        },
        {
          name: 'area',
          display: 'Area',
          type: 'text-conditional',
          order: 1,
          condition: {
            field: 'claddingType',
            value: '!Bowers Brick'
          }
        },
        {
          name: 'facingsAndScribers',
          display: 'Facings and Scribers',
          items: ['Rounded Scriber (std)', 'Square edge Scriber', 'Sill Block', 'Facings', 'Other - Please specify'],
          type: 'dropdown',
          condition: {
            field: 'claddingType',
            value:
              'JH Linea Weatherboard 150mm Cover,JH Linea Weatherboard 180mm Cover,Timber Weatherboard 150mm Cover,' +
              'Timber Vertical Weatherboard 150mm Cover,JH Oblique Vertical 200mm Cover,JH Oblique Vertical 300mm Cover,' +
              'JH Stria Horizontal 400mm Cover,JH Stria Vertical 400mm Cover'
          },
          order: 2
        },
        {
          name: 'colour1',
          display: 'Colour 1',
          type: 'text-conditional',
          order: 3,
          condition: {
            field: 'claddingType',
            value: '!Bowers Brick'
          }
        },
        {
          name: 'lrv1',
          display: 'LRV',
          type: 'number-conditional',
          suffix: '%',
          order: 4,
          condition: {
            field: 'claddingType',
            value: '!Bowers Brick'
          },
          errors: true,
          hint: true
        },
        {
          name: 'colour2',
          display: 'Colour 2',
          type: 'text-conditional',
          order: 5,
          condition: {
            field: 'claddingType',
            value: '!Bowers Brick'
          }
        },
        {
          name: 'lrv2',
          display: 'LRV',
          type: 'number-conditional',
          suffix: '%',
          order: 6,
          condition: {
            field: 'claddingType',
            value: '!Bowers Brick'
          },
          errors: true,
          hint: true
        },

        {
          name: 'brickColour1',
          display: 'Colour 1',
          items: brickTypes,
          type: 'dropdown',
          order: 1,
          condition: {
            field: 'claddingType',
            value: 'Bowers Brick'
          }
        },
        {
          name: 'brickColour1Area',
          display: 'Area',
          type: 'text-conditional',
          order: 2,
          condition: {
            field: 'claddingType',
            value: 'Bowers Brick'
          }
        },
        {
          name: 'brickColour2',
          display: 'Colour 2',
          items: brickTypes,
          type: 'dropdown',
          order: 3,
          condition: {
            field: 'claddingType',
            value: 'Bowers Brick'
          }
        },
        {
          name: 'brickColour2Area',
          display: 'Area',
          type: 'text-conditional',
          order: 4,
          condition: {
            field: 'claddingType',
            value: 'Bowers Brick'
          }
        },
        {
          name: 'mortarColour',
          display: 'Mortar Colour',
          items: ['Natural', 'Coloured to match', 'Other - Please Specify'],
          type: 'dropdown',
          order: 7,
          condition: {
            field: 'claddingType',
            value: 'Brick,The Brickery Origins Series clay brick,Bowers Brick,Bagged Brick,Painted Brick,Plaster over brick'
          },
          hint: true
        },
        {
          name: 'brickSeal',
          display: 'Brick Seal',
          items: ['Yes', 'No', 'Other - Please Specify'],
          type: 'dropdown',
          order: 8,
          condition: {
            field: 'claddingType',
            value: 'Brick,The Brickery Origins Series clay brick,Bowers Brick,Bagged Brick,Painted Brick,Plaster over brick'
          },
          hint: true
        },
        {
          name: 'additionalInfo',
          display: 'Additional Info',
          type: 'textarea-conditional',
          order: 9,
          condition: {
            field: 'claddingType',
            value: 'Bowers Brick'
          }
        }
      ]
    }
  ]
};
export default claddingConfig;
