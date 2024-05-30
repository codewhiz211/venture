export const eletricalConfig = {
  id: 21,
  name: 'electrical',
  title: 'Electrical',
  canDuplicate: true,
  canHide: true,
  component: 'spec-electrical',
  hasExtras: true,
  fields: [
    { name: 'electricalPmNote', display: 'PM Notes', type: 'textarea' },
    {
      name: 'additionalInfo',
      display: 'Additional Info',
      type: 'textarea'
    }
  ],
  optionalExtras: {
    title: 'Electrical Options',
    items: [
      { item: 'Heat Pump 3.2kw ASTG09KMTC', display: 'Heat Pump 3.2kw ASTG09KMTC', amount: 2920 },
      { item: 'Heat Pump 3.7kw ASTG12KMTC', display: 'Heat Pump 3.7kw ASTG12KMTC', amount: 2920 },
      { item: 'Heat Pump 6.0kw ASTG18KMTC', display: 'Heat Pump 6.0kw ASTG18KMTC', amount: 3548 },
      { item: 'Heat Pump 7.2kw ASTG22KMTC', display: 'Heat Pump 7.2kw ASTG22KMTC', amount: 3548 },
      { item: 'Heat Pump 8.0kw ASTG24KMTC', display: 'Heat Pump 8.0kw ASTG24KMTC', amount: 3548 },
      { item: 'Heat Pump 9.0kw ASTG30KMTC', display: 'Heat Pump 9.0kw ASTG30KMTC', amount: 3944 },
      { item: 'Heat Pump 10.3kw ASTG34KMTC', display: 'Heat Pump 10.3kw ASTG34KMTC', amount: 3944 },
      { item: 'SmartVent 4 Zone Positive Pressure System', display: 'SmartVent 4 Zone Positive Pressure System', amount: 3225 },
      { item: 'SIMX 4 Room Heat Transfer', display: 'SIMX 4 Room Heat Transfer', amount: 1323 },
      { item: 'Prewire 3 Zone Alarm', display: 'Prewire 3 Zone Alarm', amount: 288 },
      { item: 'Complete 3 Zone Alarm install', display: 'Complete 3 Zone Alarm install', amount: 1359 },
      { item: 'HDMI Cable 3m', display: 'HDMI Cable 3m', amount: 42 },
      { item: 'Extra LED Lights', display: 'Extra LED Lights', amount: 165 },
      { item: 'Extra Dbl Power Point', display: 'Extra Dbl Power Point', amount: 112 }
    ]
  },
  additionalNote:
    'Electrical extras can be added during the building process. This will be discussed specifically with ' +
    'you during our Electrical Prewire Site Meeting. Pope Electrical will quote and invoice you directly for any ' +
    'electrical extras post contract.'
};
