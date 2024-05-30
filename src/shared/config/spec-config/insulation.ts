export const insualtionConfig = {
  id: 8,
  name: 'insulation',
  title: 'Insulation',
  canDuplicate: true,
  canHide: true,
  fields: [
    { name: 'insulationPmNote', display: 'PM Notes', type: 'textarea' },
    {
      name: 'houseWalls',
      display: 'House Walls',
      items: ['None', 'Knauf R2.2 (STD)', 'Knauf R2.4 (POA)', 'Knauf R2.6 (POA)', 'Knauf R2.8 (POA)', 'Other - Please Specify'],
      historyItems: ['Knauf R2.2 (POA)', 'Knauf R2.3 (STD)'],
      type: 'dropdown'
    },
    {
      name: 'houseCeiling',
      display: 'House Ceiling',
      items: [
        'None',
        'Knauf R3.2 (POA)',
        'Knauf R3.6 (STD)',
        'Knauf R4.0 (POA)',
        'Knauf R4.6 (POA)',
        'Knauf R5.0 (POA)',
        'Other - Please Specify'
      ],
      type: 'dropdown'
    },
    {
      btnText: 'Specify Walls',
      name: 'insulatedWalls',
      display: 'Insulated Walls',
      type: 'text-optional'
    },
    {
      name: 'garageWalls',
      display: 'Garage Walls',
      items: ['No', 'Single', 'Single + Half', 'Double', 'Other - Please Specify'],
      type: 'dropdown',
      conditional: ['garageWallsRs']
    },
    {
      name: 'garageWallsRs',
      display: 'Garage Wall R Value',
      items: ['2.2 (Std)', '2.4 (POA)', '2.6 (POA)', '2.8 (POA)', 'Other - Please Specify'],
      type: 'dropdown',
      condition: {
        field: 'garageWalls',
        value: '!No'
      }
    },
    {
      name: 'garageCeiling',
      display: 'Garage Ceiling',
      items: ['No', 'Single', 'Single + Half', 'Double', 'Other - Please Specify'],
      type: 'dropdown',
      conditional: ['garageCeilingRs']
    },
    {
      name: 'garageCeilingRs',
      display: 'Garage Ceiling R Value',
      items: ['3.2 (Std)', '3.6 (POA)', '4.0 (POA)', '4.6 (POA)', 'Other - Please Specify'],
      type: 'dropdown',
      condition: {
        field: 'garageCeiling',
        value: '!No'
      }
    },
    { name: 'insulation_additional', display: 'Additional Info', type: 'textarea' }
  ],
  hasExtras: true
};
