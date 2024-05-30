import { TestBed, inject } from '@angular/core/testing';

import { LoggerService } from '../../../shared/services/logger.service';
import { PrintCustomService } from './print-custom.service';
import { loggerServiceStub } from '@shared/test/stubs';

// TODO is this really a different service to /Users/rich/Code/projects/venture/src/app/+print/components/print-custom-section/print-custom.service.spec.ts
describe('PrintCustomFieldService', () => {
  /* config for custom blocks */
  const fieldConfig = {
    name: 'tiles-bathroom-additional',
    type: 'custom-blocks',
    title: 'Main Bathroom - Additional Tiles',
    default: { tileType: '' },
    blockFields: [
      { name: 'tileType', display: 'Tile Type', type: 'text', order: 0 },
      { name: 'tileColour', display: 'Tile Colour', type: 'text', order: 1 },
      { name: 'groutColour', display: 'Grout Colour', type: 'text', order: 2 },
      { name: 'tileLayout', display: 'Tile Layout', type: 'text', order: 3 },
      { name: 'info', display: 'Additional info', type: 'textarea', fullWidth: true, order: 4 },
      {
        name: 'tileArea',
        display: 'Area',
        type: 'text-conditional',
        order: 5,
        condition: {
          field: 'tileType',
          value: '!Standard',
        },
      },
    ],
  };
  /* sample section with custom blocks defined at field level; in this case tiles */
  const sectionConfig = {
    name: 'tiles',
    title: 'Tiles',
    dontPrintTitle: true,
    hasCustom: true,
    fields: [
      {
        type: 'subtitle-conditional',
        text: 'Main Bathroom - Floor',
        condition: {
          section: 'mainBathroom',
          field: 'floorType',
          value: 'Tiled',
        },
      },
      {
        name: 'mainFloorType',
        display: 'Tile Type',
        type: 'text-conditional',
        condition: {
          section: 'mainBathroom',
          field: 'floorType',
          value: 'Tiled',
        },
      },
      {
        type: 'subtitle',
        text: 'Main Bathroom - Skirting',
      },
      {
        name: 'mainSkirtingType',
        display: 'Tile Type',
      },
      fieldConfig,
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintCustomService, { provide: LoggerService, useValue: loggerServiceStub }],
    });
  });

  it('should be created', inject([PrintCustomService], (service: PrintCustomService) => {
    expect(service).toBeTruthy();
  }));

  describe('getCustomBlocks', () => {
    it('There are no custom blocks in the spec, none are returned', inject([PrintCustomService], (service: PrintCustomService) => {
      const spec = { ['tiles-bathroom-additional']: [] };
      const blocks = service.getCustomBlocks(spec, fieldConfig);
      expect(blocks.length).toBe(0);
    }));

    it('There are custom blocks in the spec, return them', inject([PrintCustomService], (service: PrintCustomService) => {
      const spec = { ['tiles-bathroom-additional']: [{ tileType: ' ' }] };
      const blocks = service.getCustomBlocks(spec, fieldConfig);
      expect(blocks.length).toBe(1);
    }));

    it('There are custom blocks in the spec, return correct number of fields', inject(
      [PrintCustomService],
      (service: PrintCustomService) => {
        const spec = { ['tiles-bathroom-additional']: [{ tileType: ' ', tileColour: '' }] };
        const blocks = service.getCustomBlocks(spec, fieldConfig);
        expect(blocks[0].fields.length).toBe(2);
      }
    ));

    it('There are custom blocks in the spec, show conditional field if condition met', inject(
      [PrintCustomService],
      (service: PrintCustomService) => {
        const spec = {
          ['tiles-bathroom-additional']: [
            {
              tileType: 'Premium',
              tileArea: '',
            },
          ],
        };
        // the output block should contain a field named tileArea because the field tileType has value Premium
        // and the fieldConfig states that tileArea should be shown whenveer tileType value is not Standard
        const blocks = service.getCustomBlocks(spec, fieldConfig);
        expect(blocks[0].fields.length).toBe(2);
        expect(blocks[0].fields.filter((f) => f.name === 'tileArea').length).toBe(1);
      }
    ));

    it('There are custom blocks in the spec, DONT show conditional field if condition NOT met', inject(
      [PrintCustomService],
      (service: PrintCustomService) => {
        const spec = {
          ['tiles-bathroom-additional']: [
            {
              tileType: 'Standard',
              tileArea: '',
            },
          ],
        };
        // the output block should NOT contain a field named tileArea because the field tileType has value Standard
        // and the fieldConfig states that tileArea should only be shown whenv tileType value is not Standard
        const blocks = service.getCustomBlocks(spec, fieldConfig);
        expect(blocks[0].fields.length).toBe(1);
        expect(blocks[0].fields.filter((f) => f.name === 'tileArea').length).toBe(0);
      }
    ));
  });
});
