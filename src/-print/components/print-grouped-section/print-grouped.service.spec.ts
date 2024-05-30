import { TestBed, inject } from '@angular/core/testing';

import { PrintGroupedService } from './print-grouped.service';

describe('PrintGroupedService', () => {
  /* sample section with custom blocks; in this case blinds */
  const sectionConfig = {
    id: 18,
    name: 'tiles',
    title: 'Tiles',
    fields: [
      {
        type: 'subtitle-conditional',
        name: 'floorsSubTitle',
        text: 'Main Bathroom - Floor',
        condition: {
          section: 'mainBathroom',
          field: 'floorType',
          value: 'Tiled'
        }
      },
      {
        name: 'mainFloorType',
        display: 'Tile Type',
        type: 'text-conditional',
        condition: {
          section: 'mainBathroom',
          field: 'floorType',
          value: 'Tiled'
        },
        canHide: 'floorsSubTitle'
      },
      {
        type: 'subtitle',
        text: 'Main Bathroom - Skirting'
      },
      {
        name: 'mainSkirtingType',
        display: 'Tile Type'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrintGroupedService]
    });
  });

  it('should be created', inject([PrintGroupedService], (service: PrintGroupedService) => {
    expect(service).toBeTruthy();
  }));

  describe('getGroups()', () => {
    it('it should create correct amount of groups', inject([PrintGroupedService], (service: PrintGroupedService) => {
      const spec = { ['mainBathroom']: { floorType: 'Tiled' } };
      const groups = service.getGroups(spec, sectionConfig);
      expect(groups.length).toBe(2);
    }));

    it('it should set correct group title', inject([PrintGroupedService], (service: PrintGroupedService) => {
      const spec = { ['mainBathroom']: { floorType: 'Tiled' } };
      const groups = service.getGroups(spec, sectionConfig);
      expect(groups[0].title).toBe('Main Bathroom - Floor');
      expect(groups[1].title).toBe('Main Bathroom - Skirting');
    }));

    it('it should add correct amount of fields to groups', inject([PrintGroupedService], (service: PrintGroupedService) => {
      const spec = { ['mainBathroom']: { floorType: 'Tiled' } };
      const groups = service.getGroups(spec, sectionConfig);
      console.info(groups[0].fields);
      expect(groups[0].fields.length).toBe(1);
      expect(groups[1].fields.length).toBe(1);
    }));
  });
});
