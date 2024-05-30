import { TestBed, inject } from '@angular/core/testing';

import { PrintStandardService } from './print-standard.service';

describe('PrintStandardService', () => {
  /* sample section with custom blocks; in this case blinds */
  const sectionConfig = {
    id: 18,
    name: 'blinds',
    title: 'Blinds',
    dontPrintTitle: true,
    canHide: true,
    hasExtras: true,
    hasCustom: true,
    fields: [
      {
        type: 'note',
        text: 'Throughout house excluding Bathrooms, Stairways, voids and Garage (Split blinds under 3m not included in contract price)'
      }
    ],
    custom: {
      name: 'blinds-additional',
      title: 'Blinds',
      default: { blinds: '' },
      blockFields: [
        {
          name: 'blinds',
          display: 'Blinds',
          items: ['Roller - TBC', 'Roller - Sunshade', 'Roller - Blockout', 'Venetian = (POA)', 'Other - Please Specify'],
          type: 'dropdown',
          order: 0
        },
        { name: 'blindColour', display: 'Blind Colour', type: 'text', order: 1 },
        { name: 'barColour', display: 'Bar Colour', type: 'text', order: 2 },
        { name: 'chainColour', display: 'Chain Colour', type: 'text', order: 3 },
        { name: 'splits', display: 'Splits > 3m', items: ['0', '1', '2', '3'], type: 'dropdown', order: 4 },
        { name: 'areaDetails', display: 'Area & Details', type: 'textarea', fullWidth: true, order: 5 }
      ]
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintStandardService]
    });
  });

  it('should be created', inject([PrintStandardService], (service: PrintStandardService) => {
    expect(service).toBeTruthy();
  }));

  describe('displayConditional', () => {
    // it('it should display field if saved value matches trigger value', inject([PrintStandardService], (service: PrintStandardService) => {
    //   const spec = { ['blinds']: { dummy: ' ' } };
    //   const fieldConfig = {
    //     name: 'mouldedWall',
    //     display: 'Moulded Wall',
    //     items: [],
    //     type: 'image-picker',
    //     condition: {
    //       field: 'shower',
    //       value: '!tiledAsPerPlan'
    //     }
    //   };
    //   const show = service.displayConditional(spec, sectionConfig, fieldConfig);
    //   expect(show).toBe(true);
    // }));
  });
});
