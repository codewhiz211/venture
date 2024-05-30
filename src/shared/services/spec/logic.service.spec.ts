import { TestBed, inject } from '@angular/core/testing';

import { LogicService } from './logic.service';

describe('LogicService', () => {
  /* sample section configs, for reference mainly, only section name is used in tests */
  const bathSectionConfig = {
    name: 'mainBathroom',
    fields: [
      {
        name: 'shower',
        items: ['tiledAsPerPlan', 'plastic', 'glass']
      },
      {
        name: 'glassDoor',
        items: ['Sliding', 'Hinged', 'Panel'],
        condition: {
          field: 'shower',
          value: 'tiledAsPerPlan'
        }
      },
      {
        name: 'plasticDoor',
        condition: {
          field: 'shower',
          value: '!tiledAsPerPlan'
        }
      },
      {
        name: 'showerDome',
        condition: {
          field: 'shower',
          value: 'plastic,glass'
        }
      }
    ]
  };

  const claddingSectionConfig = {
    name: 'cladding^0',
    fields: [
      {
        name: 'claddingType',
        display: 'Cladding Type',
        items: ['Bowers Brick', 'Shingle']
      },
      {
        name: 'area',
        condition: {
          field: 'claddingType',
          value: '!Bowers Brick'
        }
      },
      {
        name: 'area2',
        condition: {
          field: 'claddingType',
          value: 'Bowers Brick'
        }
      }
    ]
  };

  const tilesSectionConfig = {
    name: 'tiles',
    fields: [
      {
        name: 'mainShowerTile',
        type: 'text-conditional',
        condition: {
          section: 'mainBathroom',
          field: 'shower',
          value: 'tiledAsPerPlan'
        }
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogicService]
    });
  });

  it('should be created', inject([LogicService], (service: LogicService) => {
    expect(service).toBeTruthy();
  }));

  describe('displayConditionalField - simple', () => {
    it('it should return true if field is undefined', inject([LogicService], (service: LogicService) => {
      const spec = { ['mainBathroom']: { dummy: ' ' } };
      const field = undefined;
      const show = service.displayConditionalField(spec, bathSectionConfig, field);
      expect(show).toBe(true);
    }));
    it('it should return true if field.condition is undefined', inject([LogicService], (service: LogicService) => {
      const spec = { ['mainBathroom']: { dummy: ' ' } };
      const field = { name: 'bath' };
      const show = service.displayConditionalField(spec, bathSectionConfig, field);
      expect(show).toBe(true);
    }));
    it('it should return true if field value matches triggervalue', inject([LogicService], (service: LogicService) => {
      // glassDoor field should show IF mainBathroom.shower value is tiledAsPerPlan
      const spec = { ['mainBathroom']: { shower: 'tiledAsPerPlan' } };
      const field = { name: 'glassDoor', condition: { field: 'shower', value: 'tiledAsPerPlan' } };
      const show = service.displayConditionalField(spec, bathSectionConfig, field);
      expect(show).toBe(true);
    }));
    it('it should return false if field value DOES NOT match triggervalue', inject([LogicService], (service: LogicService) => {
      // glassDoor field should show IF mainBathroom.shower value is tiledAsPerPlan
      const spec = { ['mainBathroom']: { shower: 'plastic' } };
      const field = { name: 'glassDoor', condition: { field: 'shower', value: 'tiledAsPerPlan' } };
      const show = service.displayConditionalField(spec, bathSectionConfig, field);
      expect(show).toBe(false);
    }));
    it('it should return true if negative condition AND field value DOES NOT match triggervalue', inject(
      [LogicService],
      (service: LogicService) => {
        // plasticDoor field should show IF mainBathroom.shower value is NOT tiledAsPerPlan
        const spec = { ['mainBathroom']: { shower: 'plastic' } };
        const field = { name: 'plasticDoor', condition: { field: 'shower', value: '!tiledAsPerPlan' } };
        const show = service.displayConditionalField(spec, bathSectionConfig, field);
        expect(show).toBe(true);
      }
    ));
    it('it should return false if negative condition AND field value DOES match triggervalue', inject(
      [LogicService],
      (service: LogicService) => {
        // plasticDoor field should NOT show IF mainBathroom.shower value is tiledAsPerPlan
        const spec = { ['mainBathroom']: { shower: 'tiledAsPerPlan' } };
        const field = { name: 'plasticDoor', condition: { field: 'shower', value: '!tiledAsPerPlan' } };
        const show = service.displayConditionalField(spec, bathSectionConfig, field);
        expect(show).toBe(false);
      }
    ));
    it('it should return true if multiple triggers AND field value matches one', inject([LogicService], (service: LogicService) => {
      // showerDome field should show IF mainBathroom.shower value is plastic OR glass
      let spec = { ['mainBathroom']: { shower: 'plastic' } };
      const field = { name: 'showerDome', condition: { field: 'shower', value: 'plastic,glass' } };
      let show = service.displayConditionalField(spec, bathSectionConfig, field);
      expect(show).toBe(true);

      spec = { ['mainBathroom']: { shower: 'glass' } };
      show = service.displayConditionalField(spec, bathSectionConfig, field);
      expect(show).toBe(true);
    }));
    it('it should return false if multiple triggers AND field matches none', inject([LogicService], (service: LogicService) => {
      // showerDome field should NOT show IF mainBathroom.shower value is NOT plastic OR glass
      let spec = { ['mainBathroom']: { shower: 'tiled' } };
      const field = { name: 'showerDome', condition: { field: 'shower', value: 'plastic,glass' } };
      let show = service.displayConditionalField(spec, bathSectionConfig, field);
      expect(show).toBe(false);
    }));
  });

  describe('displayConditionalField - custom', () => {
    it('it should return true if field value matches triggervalue', inject([LogicService], (service: LogicService) => {
      // area field should show IF custom cladding block 0 has value of 'Bowers Brick' for  claddingType
      const spec = { ['cladding']: { 0: { claddingType: 'Bowers Brick' } } };
      const field = { name: 'area', condition: { field: 'claddingType', value: 'Bowers Brick' } };
      const show = service.displayConditionalField(spec, claddingSectionConfig, field);
      expect(show).toBe(true);
    }));
    it('it should return false if field value DOES NOT match triggervalue', inject([LogicService], (service: LogicService) => {
      // area field should not show IF custom cladding block 0 has value different from 'Bowers Brick' for  claddingType
      const spec = { ['cladding']: { 0: { claddingType: 'Bowers Brick' } } };
      const field = { name: 'area', condition: { field: 'claddingType', value: 'Shingle' } };
      const show = service.displayConditionalField(spec, claddingSectionConfig, field);
      expect(show).toBe(false);
    }));
    it('it should return true if negative condition AND field value does not match triggervalue', inject(
      [LogicService],
      (service: LogicService) => {
        const spec = { ['cladding']: { 0: { claddingType: 'Shingle' } } };
        const field = { name: 'area', condition: { field: 'claddingType', value: '!Bowers Brick' } };
        const show = service.displayConditionalField(spec, claddingSectionConfig, field);
        expect(show).toBe(true);
      }
    ));
    it('it should return false if negative condition AND field value DOES match triggervalue', inject(
      [LogicService],
      (service: LogicService) => {
        // area field should not show IF custom cladding block 0 has value different from 'Bowers Brick' for  claddingType
        const spec = { ['cladding']: { 0: { claddingType: 'Bowers Brick' } } };
        const field = { name: 'area', condition: { field: 'claddingType', value: '!Bowers Brick' } };
        const show = service.displayConditionalField(spec, claddingSectionConfig, field);
        expect(show).toBe(false);
      }
    ));
  });
});
