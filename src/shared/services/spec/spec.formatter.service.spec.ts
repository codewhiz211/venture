import { TestBed, inject } from '@angular/core/testing';

import { ORDER_LIST } from '@shared/export/spec.fortest';
import SPEC from '../../test/default-spec';
import { SpecFormatterService } from './spec.formatter.service';
import appliancesConfig from '@shared/config/spec-config/appliances';
import claddingConfig from '@shared/config/spec-config/cladding';
import { contactDetailsConfig } from '@shared/config/spec-config/contactDetails';
import exteriorConfig from '@shared/config/spec-config/exterior';
import garageConfig from '@shared/config/spec-config/garage';
import { getTestSpec } from '@shared/test/test-utils';
import interiorConfig from '@shared/config/spec-config/interior';
import joineryConfig from '@shared/config/spec-config/joinery';
import kitchenConfig from '@shared/config/spec-config/kitchen';
import landscapeConfig from '@shared/config/spec-config/landscape';
import mainBathroomConfig from '@shared/config/spec-config/main-bathroom';
import { mergeRight } from 'ramda';

const getFieldConfig = (sectionConfig, field, blockField = null) => {
  if (blockField) {
    return sectionConfig.fields.find((f) => f.name === field).blockFields.find((f) => f.name === blockField);
  } else {
    return sectionConfig.fields.find((f) => f.name === field);
  }
};

describe('SpecFormatterService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [SpecFormatterService],
    })
  );

  it('should be created', () => {
    const service: SpecFormatterService = TestBed.inject(SpecFormatterService);
    expect(service).toBeTruthy();
  });

  describe('updateSpec', () => {
    describe('values', () => {
      it('getUpdateSpecChanges_std_field', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {});
        const FIELD_CONFIG = getFieldConfig(garageConfig, 'garageColour');
        const update = service.getUpdateSpecChanges(spec, garageConfig, FIELD_CONFIG, { garageColour: 'ebony' });
        expect(update).toEqual({
          garage: { garageColour: 'ebony' },
        });
      }));

      it('getUpdateSpecChanges_custom_block_field_only_one_block', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          'cladding-additional': {
            0: {
              area: 100,
            },
          },
        });
        const FIELD_CONFIG = getFieldConfig(claddingConfig, 'cladding-additional', 'claddingType');
        const update = service.getUpdateSpecChanges(spec, { name: 'cladding-additional^0' }, FIELD_CONFIG, {
          claddingType: 'Bowers Brick',
        });
        expect(update).toEqual({
          'cladding-additional': {
            0: {
              claddingType: 'Bowers Brick',
              area: 100,
              claddingType_hint: null, // TODO can we ignore these?
              lrv1_error: null,
              lrv2_error: null,
            },
          },
        });
      }));

      it('getUpdateSpecChanges_custom_block_field_multiple_blocks', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          'cladding-additional': {
            0: {
              area: 100,
              claddingType_hint: null, // TODO can we ignore these?
              lrv1_error: null,
              lrv2_error: null,
            },
          },
        });
        const FIELD_CONFIG = getFieldConfig(claddingConfig, 'cladding-additional', 'claddingType');
        const update = service.getUpdateSpecChanges(spec, { name: 'cladding-additional^1' }, FIELD_CONFIG, {
          claddingType: 'Bowers Brick',
        });
        expect(update).toEqual({
          'cladding-additional': {
            1: {
              claddingType: 'Bowers Brick',
              claddingType_hint: null, // TODO can we ignore these?
              lrv1_error: null,
              lrv2_error: null,
            },
          },
        });
      }));
    });

    describe('hints', () => {
      it('getUpdateSpecChanges_std_field_sets_always_hint', inject([SpecFormatterService], (service: SpecFormatterService) => {
        // Hint should always be set
        const spec = getTestSpec(SPEC, {});
        const FIELD_CONFIG = getFieldConfig(exteriorConfig, 'downpipesColour1');
        const update = service.getUpdateSpecChanges(spec, exteriorConfig, FIELD_CONFIG, { downpipesColour1: 'Red' });
        expect(update).toEqual({
          exterior: { downpipesColour1: 'Red', downpipesColour1_hint: 'Downpipe colour 1 is for Brick' },
        });
      }));

      it('getUpdateSpecChanges_std_field_sets_value_hint', inject([SpecFormatterService], (service: SpecFormatterService) => {
        // Hint should be set when value is 'Yes' (also sets an extra)
        const spec = getTestSpec(SPEC, {});
        const FIELD_CONFIG = getFieldConfig(garageConfig, 'atticLadder');
        const update = service.getUpdateSpecChanges(spec, garageConfig, FIELD_CONFIG, { atticLadder: 'Yes' });
        expect(update).toEqual({
          garage: { atticLadder: 'Yes', atticLadder_hint: 'Includes 2 x kopine floor sheets' },
        });
      }));

      it('getUpdateSpecChanges_std_field_removes_value_hint', inject([SpecFormatterService], (service: SpecFormatterService) => {
        // Hint should be remove when value is 'No'
        const spec = getTestSpec(SPEC, {});
        const FIELD_CONFIG = getFieldConfig(garageConfig, 'atticLadder');
        const update = service.getUpdateSpecChanges(spec, garageConfig, FIELD_CONFIG, { atticLadder: 'No' });
        expect(update).toEqual({
          garage: { atticLadder: 'No', atticLadder_hint: null },
        });
      }));

      it('getUpdateSpecChanges_std_field_sets_expression_hint', inject([SpecFormatterService], (service: SpecFormatterService) => {
        // Hint should be set when value is < 9'
        const spec = getTestSpec(SPEC, {});
        const FIELD_CONFIG = getFieldConfig(exteriorConfig, 'lowestRoofPitch');
        const update = service.getUpdateSpecChanges(spec, exteriorConfig, FIELD_CONFIG, { lowestRoofPitch: 7 });
        expect(update).toEqual({
          exterior: { lowestRoofPitch: 7, lowestRoofPitch_hint: 'Plumbdeck profile required to areas under 9 degrees' },
        });
      }));

      it('getUpdateSpecChanges_std_field_removes_expression_hint', inject([SpecFormatterService], (service: SpecFormatterService) => {
        // Hint should be set when value is >= 9'
        const spec = getTestSpec(SPEC, {});
        const FIELD_CONFIG = getFieldConfig(exteriorConfig, 'lowestRoofPitch');
        const update = service.getUpdateSpecChanges(spec, exteriorConfig, FIELD_CONFIG, { lowestRoofPitch: 9 });
        expect(update).toEqual({
          exterior: { lowestRoofPitch: 9, lowestRoofPitch_hint: null },
        });
      }));

      it('getUpdateSpecChanges_custom_field_sets_value_hint', inject([SpecFormatterService], (service: SpecFormatterService) => {
        // Hint should always be set
        const spec = getTestSpec(SPEC, {
          'cladding-additional': {
            0: {
              claddingType: 'Shadowclad 300 Batten',
            },
          },
        });
        const FIELD_CONFIG = getFieldConfig(claddingConfig, 'cladding-additional', 'lrv1');
        const update = service.getUpdateSpecChanges(spec, { name: 'cladding-additional^0' }, FIELD_CONFIG, { lrv1: 20 });
        expect(update).toEqual({
          'cladding-additional': {
            0: {
              lrv1: 20,
              claddingType: 'Shadowclad 300 Batten',
              lrv1_hint: 'No dark colours should be selected when using Shadowclad 300 Batten',
              lrv1_error: null,
            },
          },
        });
      }));
    });

    describe('errors', () => {
      it('getUpdateSpecChanges_std_field_sets_error_lvl1_rockcote', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          'cladding-additional': [
            {
              claddingType: 'Rockcote plaster',
            },
          ],
        });
        const FIELD_CONFIG = getFieldConfig(claddingConfig, 'cladding-additional', 'lrv1');
        const update = service.getUpdateSpecChanges(spec, { name: 'cladding-additional^0' }, FIELD_CONFIG, { lrv1: 20 });

        expect(update).toEqual({
          'cladding-additional': {
            0: {
              claddingType: 'Rockcote plaster',
              lrv1: 20,
              lrv1_hint: null,
              lrv1_error: 'Error: LRV should be greater than 25% when using Rockcote plaster',
            },
          },
        });
      }));
    });

    describe('prefills', () => {
      it('getUpdateSpecChanges_std_field: appropriate prefills set when bath is TBC', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {});
          const FIELD_CONFIG = getFieldConfig(mainBathroomConfig, 'bath');
          const update = service.getUpdateSpecChanges(spec, mainBathroomConfig, FIELD_CONFIG, { bath: 'TBC' });
          expect(update).toEqual({
            mainBathroom: { bath: 'TBC', bathMixer: 'hansaTBC', bathMixerAndSpoutPlacement: 'Centre (std)' },
          });
        }
      ));
      it('getUpdateSpecChanges_std_field: appropriate prefills set when consultantName set', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {});
          const FIELD_CONFIG = getFieldConfig(contactDetailsConfig, 'consultantName');
          const update = service.getUpdateSpecChanges(spec, contactDetailsConfig, FIELD_CONFIG, { consultantName: 'Richard Wright' });
          expect(update).toEqual({
            contact_details: {
              consultantName: 'Richard Wright',
              consultantEmail: 'richard@venturedevelopments.co.nz',
              consultantPhone: '0211434448',
            },
          });
        }
      ));
      it('getUpdateSpecChanges_std_field: appropriate prefills set when projectManagerName set', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {});
          const FIELD_CONFIG = getFieldConfig(contactDetailsConfig, 'projectManagerName');
          const update = service.getUpdateSpecChanges(spec, contactDetailsConfig, FIELD_CONFIG, { projectManagerName: 'Mike Laupama' });
          expect(update).toEqual({
            contact_details: {
              projectManagerName: 'Mike Laupama',
              projectManagerEmail: 'mike.laupama@venturedevelopments.co.nz',
              projectManagerPhone: '0273042259',
            },
          });
        }
      ));
      it('getUpdateSpecChanges_std_field: appropriate prefills set when applianceSupplier is Noel Leeming', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {});
          const FIELD_CONFIG = getFieldConfig(appliancesConfig, 'applianceSupplier');
          const update = service.getUpdateSpecChanges(spec, appliancesConfig, FIELD_CONFIG, { applianceSupplier: 'Noel Leeming' });
          expect(update).toEqual({
            appliances: {
              applianceSupplier: 'Noel Leeming',
              oven: 'function7',
              dishwasher: 'westinghouse',
              hob: 'touch600',
            },
          });
        }
      ));

      it('getUpdateSpecChanges_std_field: appropriate prefills set when applianceSupplier is F&P Direct', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {});
          const FIELD_CONFIG = getFieldConfig(appliancesConfig, 'applianceSupplier');
          const update = service.getUpdateSpecChanges(spec, appliancesConfig, FIELD_CONFIG, { applianceSupplier: 'F&P Direct' });
          expect(update).toEqual({
            appliances: {
              applianceSupplier: 'F&P Direct',
              oven: 'fpBuiltInOven60',
              dishwasher: 'fpDishwasher15',
              hob: 'fpElectricCooktop60',
            },
          });
        }
      ));

      it('getUpdateSpecChanges_std_field: appropriate prefills set when applianceSupplier is Premier Appliances', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {});
          const FIELD_CONFIG = getFieldConfig(appliancesConfig, 'applianceSupplier');
          const update = service.getUpdateSpecChanges(spec, appliancesConfig, FIELD_CONFIG, {
            applianceSupplier: 'Premier Appliances',
          });
          expect(update).toEqual({
            appliances: {
              applianceSupplier: 'Premier Appliances',
              oven: 'boschSerie6Oven',
              dishwasher: 'boschSerie4BuiltUnderDishwasher',
              hob: 'boschSerie6Electric',
            },
          });
        }
      ));
    });

    describe('custom', () => {
      it('getUpdateSpecChanges_std_field: custom value added when present', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {});
          const FIELD_CONFIG = getFieldConfig(garageConfig, 'atticLadder');
          const update = service.getUpdateSpecChanges(spec, garageConfig, FIELD_CONFIG, {
            atticLadder: 'Custom',
            atticLadder_custom: 'Custom', // calling method will set _custom property
          });
          expect(update).toEqual({
            garage: { atticLadder: 'Custom', atticLadder_hint: null },
            custom_value: {
              garage: {
                atticLadder: { value: 'Custom', dismissed: false },
              },
            },
          });
        }
      ));
      it('getUpdateSpecChanges_std_field: custom value added when present and does not overwrite existing', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            custom_value: {
              bathroom: {
                bath: { value: 'Custom', dismissed: true },
              },
            },
          });
          const FIELD_CONFIG = getFieldConfig(garageConfig, 'atticLadder');
          const update = service.getUpdateSpecChanges(spec, garageConfig, FIELD_CONFIG, {
            atticLadder: 'Custom',
            atticLadder_custom: 'Custom', // calling method will set _custom property
          });
          expect(update).toEqual({
            garage: { atticLadder: 'Custom', atticLadder_hint: null },
            custom_value: {
              garage: {
                atticLadder: { value: 'Custom', dismissed: false },
              },
              bathroom: {
                bath: { value: 'Custom', dismissed: true },
              },
            },
          });
        }
      ));
      it('getUpdateSpecChanges_custom_field: custom value added when present', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            custom_value: {
              garage: {
                atticLadder: { value: 'Custom', dismissed: false },
              },
            },
          });
          const FIELD_CONFIG = getFieldConfig(claddingConfig, 'cladding-additional', 'claddingType');
          const update = service.getUpdateSpecChanges(spec, { name: 'cladding-additional^0' }, FIELD_CONFIG, {
            claddingType: 'Pop',
            claddingType_custom: 'Pop',
          });

          expect(update).toEqual({
            'cladding-additional': {
              0: {
                claddingType: 'Pop',
                claddingType_hint: null,
                lrv1_error: null,
                lrv2_error: null,
              },
            },
            custom_value: {
              garage: {
                atticLadder: { value: 'Custom', dismissed: false },
              },
              'cladding-additional^0': {
                claddingType: { value: 'Pop', dismissed: false },
              },
            },
          });
        }
      ));

      // @ts-ignore
      it('getUpdateSpecChanges_std_field: custom value added when present and does not overwrite existing values in the same section', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            custom_value: {
              mainBathroom: {
                bath: { value: 'Custom', dismissed: true },
              },
            },
          });
          const FIELD_CONFIG = getFieldConfig(mainBathroomConfig, 'glassDoor');
          const update = service.getUpdateSpecChanges(spec, mainBathroomConfig, FIELD_CONFIG, {
            glassDoor: 'Custom',
            glassDoor_custom: 'Custom',
          });
          expect(update).toEqual({
            mainBathroom: {
              glassDoor: 'Custom',
            },
            custom_value: {
              mainBathroom: {
                glassDoor: { value: 'Custom', dismissed: false },
                bath: { value: 'Custom', dismissed: true },
              },
            },
          });
        }
      ));
    });

    fdescribe('extras', () => {
      // !!!!! UPDATE We no longer add pre-defined extras in response to changes to the spec see SC4790
      // !!!!! SO these tests are now confirming that extras are NOT added.

      it('getUpdateSpecChanges_std_field: applySelectedExtra', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {});
        const FIELD_CONFIG = getFieldConfig(interiorConfig, 'featureWall1Colour');
        const update = service.getUpdateSpecChanges(spec, interiorConfig, FIELD_CONFIG, {
          featureWall1Colour: 'Blue',
        });
        expect(update).toEqual({
          interior: { featureWall1Colour: 'Blue' },
        });
      }));

      it('getUpdateSpecChanges_std_field: applySimpleExtra', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {});
        const FIELD_CONFIG = getFieldConfig(appliancesConfig, 'waterToFridge');
        const update = service.getUpdateSpecChanges(spec, appliancesConfig, FIELD_CONFIG, {
          waterToFridge: 'Yes',
        });
        expect(update).toEqual({
          appliances: { waterToFridge: 'Yes', waterToFridge_hint: 'Does not include install of filter' },
        });
      }));

      it('getUpdateSpecChanges_std_field: applyMultiExtra', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {});
        const FIELD_CONFIG = getFieldConfig(appliancesConfig, 'hob');
        const update = service.getUpdateSpecChanges(spec, appliancesConfig, FIELD_CONFIG, {
          hob: 'gas',
        });
        expect(update).toEqual({
          appliances: { hob: 'gas' },
        });
      }));

      it('getUpdateSpecChanges_std_field: applyDependentExtra', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          joinery: {
            style: 'Axis',
          },
        });
        const FIELD_CONFIG = getFieldConfig(joineryConfig, 'styleCodeAxis');
        const update = service.getUpdateSpecChanges(spec, joineryConfig, FIELD_CONFIG, {
          styleCodeAxis: 'ax02',
        });
        expect(update).toEqual({
          joinery: { styleCodeAxis: 'ax02' },
        });
      }));

      it('getUpdateSpecChanges_std_field: resetDependentExtra', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          joinery: {
            style: 'Axis',
          },
        });
        const FIELD_CONFIG = getFieldConfig(joineryConfig, 'style');
        const update = service.getUpdateSpecChanges(spec, joineryConfig, FIELD_CONFIG, {
          style: 'None',
        });
        expect(update).toEqual({
          joinery: { style: 'None' },
        });
      }));

      it('getUpdateSpecChanges_std_field: dependentLogic', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          joinery: {
            doorFrameColour: 'Blue',
            windowFrameColour: 'Blue',
          },
        });
        const FIELD_CONFIG = getFieldConfig(joineryConfig, 'doorColour');
        const update = service.getUpdateSpecChanges(spec, joineryConfig, FIELD_CONFIG, {
          doorColour: 'Red',
        });
        expect(update).toEqual({
          joinery: { doorColour: 'Red' },
        });
      }));

      it('getUpdateSpecChanges_std_field: dynamicAmount', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          joinery: {
            numWindows: 10,
          },
        });
        const FIELD_CONFIG = getFieldConfig(joineryConfig, 'securityStays');
        const update = service.getUpdateSpecChanges(spec, joineryConfig, FIELD_CONFIG, {
          securityStays: 'Yes',
        });
        expect(update).toEqual({
          joinery: { securityStays: 'Yes' },
        });
      }));

      it('getUpdateSpecChanges_std_field: dynamicAmountSource', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          joinery: {
            numWindows: 10,
            securityStays: 'Yes',
          },
        });
        const FIELD_CONFIG = getFieldConfig(joineryConfig, 'numWindows');
        const update = service.getUpdateSpecChanges(spec, joineryConfig, FIELD_CONFIG, {
          numWindows: 20,
        });
        expect(update).toEqual({
          joinery: { numWindows: 20 },
        });
      }));

      it('getUpdateSpecChanges_std_field: dynamicAmountTwo', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          kitchen: {
            quotePC: 10,
          },
        });
        const FIELD_CONFIG = getFieldConfig(kitchenConfig, 'quote');
        const update = service.getUpdateSpecChanges(spec, kitchenConfig, FIELD_CONFIG, {
          quote: 1000,
        });
        expect(update).toEqual({
          kitchen: { quote: 1000 },
        });
      }));

      it('getUpdateSpecChanges_std_field: dynamicAmountSourceTwo', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          kitchen: {
            quote: 1000,
            quotePC: 10,
          },
        });
        const FIELD_CONFIG = getFieldConfig(kitchenConfig, 'quotePC');
        const update = service.getUpdateSpecChanges(spec, kitchenConfig, FIELD_CONFIG, {
          quotePC: 100,
        });
        expect(update).toEqual({
          kitchen: { quotePC: 100 },
        });
      }));

      it('getUpdateSpecChanges_std_field: threshold', inject([SpecFormatterService], (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {});
        const FIELD_CONFIG = getFieldConfig(kitchenConfig, 'quote');
        const update = service.getUpdateSpecChanges(spec, kitchenConfig, FIELD_CONFIG, {
          quote: 12501,
        });
        expect(update).toEqual({
          kitchen: { quote: 12501 },
        });
      }));

      it('getUpdateSpecChanges_std_field: value (extra type: selected) changes from with extra fee to without extra fee', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            interior: {
              featureWall1Colour: 'red',
            },
            extras: {
              interior: [
                { item: 'red', display: 'Feature wall colour 1', amount: 400, field: 'featureWall1Colour', postContract: undefined },
              ],
            },
          });

          const FIELD_CONFIG = getFieldConfig(interiorConfig, 'featureWall1Colour');
          const update = service.getUpdateSpecChanges(spec, interiorConfig, FIELD_CONFIG, { featureWall1Colour: '' });
          expect(update).toEqual({ interior: { featureWall1Colour: '' }, extras: { interior: [] } });
        }
      ));

      it('getUpdateSpecChanges_std_field: value (extra type: simple) changes from with extra fee to without extra fee', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            kitchen: {
              kitchen_manual: '50000',
              kitchenMixer: 'zeon',
            },
            extras: {
              kitchen: [
                { item: 'zeon', display: 'Zeon Kitchen mixer', amount: 75, field: 'kitchenMixer', postContract: undefined },
                { _amount: '50000', amount: 0, display: 'AC02', field: 'kitchen_manual', includeInBuildPrice: true },
              ],
            },
          });
          const FIELD_CONFIG = getFieldConfig(kitchenConfig, 'kitchenMixer');
          const update = service.getUpdateSpecChanges(spec, kitchenConfig, FIELD_CONFIG, { kitchenMixer: '' });
          expect(update).toEqual({
            kitchen: { kitchenMixer: '' },
            extras: {
              kitchen: [{ _amount: '50000', amount: 0, display: 'AC02', field: 'kitchen_manual', includeInBuildPrice: true }],
            },
          });
        }
      ));

      it('getUpdateSpecChanges_std_field: value (extra type: multi) changes from with extra fee to without extra fee', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            appliances: {
              hob: 'touch900+',
            },
            extras: {
              appliances: [{ item: 'touch900+', display: '900 Touch - WHC943BC', amount: 417, field: 'hob', postContract: undefined }],
            },
          });
          const FIELD_CONFIG = getFieldConfig(appliancesConfig, 'hob');
          const update = service.getUpdateSpecChanges(spec, appliancesConfig, FIELD_CONFIG, { hob: '' });
          expect(update).toEqual({ appliances: { hob: '' }, extras: { appliances: [] } });
        }
      ));

      it('getUpdateSpecChanges_std_field: value (extra type: dependentLogic) changes from with extra fee to without extra fee', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            joinery: {
              style: 'Axis',
              styleCodeAxis: 'ax02',
            },
            extras: {
              joinery: [{ item: 'ax02', display: 'Entry Door, Code AX02', amount: 380, field: 'styleCodeAxis', postContract: undefined }],
            },
          });
          const FIELD_CONFIG = getFieldConfig(joineryConfig, 'styleCodeAxis');
          const update = service.getUpdateSpecChanges(spec, joineryConfig, FIELD_CONFIG, { styleCodeAxis: 'ax00' });
          expect(update).toEqual({ joinery: { styleCodeAxis: 'ax00' }, extras: { joinery: [] } });
        }
      ));

      it('getUpdateSpecChanges_std_field: value (extra type: dependentLogic) changes from with extra fee to without extra fee', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            joinery: {
              doorColour: 'arcticWhite',
              doorFrameColour: 'mattAppliance',
            },
            extras: {
              joinery: [
                { item: 'mattAppliance', display: 'Door frame colour', amount: 200, field: 'doorFrameColour', postContract: undefined },
              ],
            },
          });

          const FIELD_CONFIG = getFieldConfig(joineryConfig, 'doorFrameColour');
          const update = service.getUpdateSpecChanges(spec, joineryConfig, FIELD_CONFIG, { doorFrameColour: 'arcticWhite' });
          expect(update).toEqual({ joinery: { doorFrameColour: 'arcticWhite' }, extras: { joinery: [] } });
        }
      ));

      it('getUpdateSpecChanges_std_field: value (extra type: dependentLogic) changes from with extra fee to without extra fee 2', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            joinery: {
              doorColour: 'arcticWhite',
              doorFrameColour: 'mattAppliance',
            },
            extras: {
              joinery: [
                { item: 'mattAppliance', display: 'Door frame colour', amount: 200, field: 'doorFrameColour', postContract: undefined },
              ],
            },
          });

          const FIELD_CONFIG = getFieldConfig(joineryConfig, 'doorColour');
          const update = service.getUpdateSpecChanges(spec, joineryConfig, FIELD_CONFIG, { doorColour: 'mattAppliance' });
          expect(update).toEqual({
            joinery: { doorColour: 'mattAppliance' },
            extras: {
              joinery: [
                { item: 'mattAppliance', display: 'Door frame colour', amount: 200, field: 'doorFrameColour', postContract: undefined },
              ],
            },
          });
        }
      ));

      it('getUpdateSpecChanges_std_field: value (extra type: dynamicAmount) changes from with extra fee to without extra fee', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            landscape: {
              lawnType: 'Prepped with Subdivision topsoil and Ready lawned',
              lawnArea: '100',
            },
            extras: {
              landscape: [
                {
                  item: 'Prepped with Subdivision topsoil and Ready lawned',
                  display: 'Lawn ready lawned',
                  amount: 1500,
                  field: 'lawnType',
                  postContract: undefined,
                },
              ],
            },
          });

          const FIELD_CONFIG = getFieldConfig(landscapeConfig, 'lawnType');
          const update = service.getUpdateSpecChanges(spec, landscapeConfig, FIELD_CONFIG, { lawnType: 'No Landscaping' });
          expect(update).toEqual({ landscape: { lawnType: 'No Landscaping' }, extras: { landscape: [] } });
        }
      ));

      it('getUpdateSpecChanges_std_field: value (extra type: dynamicAmount) changes from with extra fee to without extra fee 2', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            landscape: {
              lawnType: 'Prepped with Subdivision topsoil and Ready lawned',
              lawnArea: '150',
            },
            extras: {
              landscape: [{ item: 150, display: 'Lawn ready lawned', amount: 2250, field: 'lawnArea', postContract: undefined }],
            },
          });
          const FIELD_CONFIG = getFieldConfig(landscapeConfig, 'lawnType');
          const update = service.getUpdateSpecChanges(spec, landscapeConfig, FIELD_CONFIG, { lawnType: 'No Landscaping' });
          expect(update).toEqual({ landscape: { lawnType: 'No Landscaping' }, extras: { landscape: [] } });
        }
      ));

      it('getUpdateSpecChanges_std_field: value (extra type: dynamicAmountSource) changes from with extra fee to without extra fee', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            landscape: {
              lawnType: 'Prepped with Subdivision topsoil and Ready lawned',
              lawnArea: '100',
            },
            extras: {
              landscape: [
                {
                  item: 'Prepped with Subdivision topsoil and Ready lawned',
                  display: 'Lawn ready lawned',
                  amount: 1500,
                  field: 'lawnType',
                  postContract: undefined,
                },
              ],
            },
          });
          const FIELD_CONFIG = getFieldConfig(landscapeConfig, 'lawnArea');
          const update = service.getUpdateSpecChanges(spec, landscapeConfig, FIELD_CONFIG, { lawnArea: '' });
          expect(update).toEqual({ landscape: { lawnArea: '' }, extras: { landscape: [] } });
        }
      ));

      it('getUpdateSpecChanges_std_field: value (extra type: dynamicAmountSource) changes from with extra fee to without extra fee 2', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            landscape: {
              lawnType: 'Prepped with Subdivision topsoil and Ready lawned',
              lawnArea: '150',
            },
            extras: {
              landscape: [{ item: 150, display: 'Lawn ready lawned', amount: 2250, field: 'lawnArea', postContract: undefined }],
            },
          });
          const FIELD_CONFIG = getFieldConfig(landscapeConfig, 'lawnArea');
          const update = service.getUpdateSpecChanges(spec, landscapeConfig, FIELD_CONFIG, { lawnArea: '' });
          expect(update).toEqual({ landscape: { lawnArea: '' }, extras: { landscape: [] } });
        }
      ));

      it('getUpdateSpecChanges_std_field: value (extra type: dynamicAmountTwo) changes from with extra fee to without extra fee', inject(
        [SpecFormatterService],
        (service: SpecFormatterService) => {
          const spec = getTestSpec(SPEC, {
            kitchen: {
              quote: '2000',
              quotePC: '1000',
            },
            extras: {
              kitchen: [{ item: 2000, display: 'Kitchen Quote', amount: 1000, field: 'quote', postContract: undefined }],
            },
          });
          const FIELD_CONFIG = getFieldConfig(kitchenConfig, 'quote');
          const update = service.getUpdateSpecChanges(spec, kitchenConfig, FIELD_CONFIG, { quote: '' });
          console.info('update', update);
          expect(update).toEqual({ kitchen: { quote: '' }, extras: { kitchen: [] } });
        }
      ));
    });

    it('getUpdateSpecChanges_std_field: value (extra type: dynamicAmountTwo) changes from with extra fee to without extra fee 2', inject(
      [SpecFormatterService],
      (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          kitchen: {
            quote: '2000',
            quotePC: '1000',
          },
          extras: {
            kitchen: [{ item: 1000, display: 'Kitchen Quote', amount: 1000, field: 'quotePC', postContract: undefined }],
          },
        });
        const FIELD_CONFIG = getFieldConfig(kitchenConfig, 'quote');
        const update = service.getUpdateSpecChanges(spec, kitchenConfig, FIELD_CONFIG, { quote: '' });
        expect(update).toEqual({
          kitchen: { quote: '' },
          extras: { kitchen: [] },
        });
      }
    ));

    it('getUpdateSpecChanges_std_field: value (extra type: dynamicAmountSourceTwo) changes from with extra fee to without extra fee', inject(
      [SpecFormatterService],
      (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          kitchen: {
            quote: '2000',
            quotePC: '1000',
          },
          extras: {
            kitchen: [{ item: 2000, display: 'Kitchen Quote', amount: 1000, field: 'quote', postContract: undefined }],
          },
        });
        const FIELD_CONFIG = getFieldConfig(kitchenConfig, 'quotePC');
        const update = service.getUpdateSpecChanges(spec, kitchenConfig, FIELD_CONFIG, { quotePC: '' });
        expect(update).toEqual({
          kitchen: { quotePC: '' },
          extras: { kitchen: [] },
        });
      }
    ));

    it('getUpdateSpecChanges_std_field: value (extra type: dynamicAmountSourceTwo) changes from with extra fee to without extra fee 2', inject(
      [SpecFormatterService],
      (service: SpecFormatterService) => {
        const spec = getTestSpec(SPEC, {
          kitchen: {
            quote: '2000',
            quotePC: '1000',
          },
          extras: {
            kitchen: [{ item: 1000, display: 'Kitchen Quote', amount: 1000, field: 'quotePC', postContract: undefined }],
          },
        });
        const FIELD_CONFIG = getFieldConfig(kitchenConfig, 'quotePC');
        const update = service.getUpdateSpecChanges(spec, kitchenConfig, FIELD_CONFIG, { quotePC: '' });
        expect(update).toEqual({ kitchen: { quotePC: '' }, extras: { kitchen: [] } });
      }
    ));
  });

  describe('other change spec methods', () => {
    it('getAddCustomBlockChanges', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        'blinds-additional': [{ blinds: ' ' }],
      });
      const NEW_BLOCK_PAYLOAD = { blinds: ' ' };
      const updateCustomValues = service.getAddCustomBlockChanges(spec, 'blinds-additional', 1, NEW_BLOCK_PAYLOAD);
      expect(updateCustomValues).toEqual({
        'blinds-additional': { 1: { blinds: ' ' } },
      });
    }));

    it('getRemoveCustomBlockChanges', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        'blinds-additional': [
          { blinds: ' ', blindColour: 'Red' },
          { blinds: ' ', blindColour: 'Green' },
        ],
      });

      const updateCustomValues = service.getRemoveCustomBlockChanges(spec, 'blinds-additional', 1);
      expect(updateCustomValues).toEqual({
        'blinds-additional': [{ blinds: ' ', blindColour: 'Red' }],
        extras: {
          'blinds-additional^1': null,
        },
      });
    }));

    it('getAddManualExtra_when_pre_contract', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        extras_manual: {
          garage: [{ display: 'Flooring', item: 'Flooring', amount: '10000', field: 'garage_manual' }],
        },
      });
      const EXTRA_TO_ADD = { display: 'Sink', item: 'Sink', amount: '3000', field: 'garage_manual' };
      const updateCustomValues = service.getAddManualExtra(spec, 'garage', EXTRA_TO_ADD);
      expect(updateCustomValues).toEqual({
        extras_manual: {
          section_details: ' ',
          garage: [
            { display: 'Flooring', item: 'Flooring', amount: '10000', field: 'garage_manual' },
            { display: 'Sink', item: 'Sink', amount: '3000', field: 'garage_manual', postContract: undefined },
          ],
        },
      });
    }));

    it('getAddManualExtra_when_post_contract', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        details: {
          postContract: true,
        },
        extras_manual: {
          garage: [{ display: 'Flooring', item: 'Flooring', amount: '10000', field: 'garage_manual' }],
        },
      });
      const EXTRA_TO_ADD = { display: 'Sink', item: 'Sink', amount: '3000', field: 'garage_manual' };
      const updateManualExtras = service.getAddManualExtra(spec, 'garage', EXTRA_TO_ADD);
      expect(updateManualExtras).toEqual({
        extras_manual: {
          section_details: ' ',
          garage: [
            { display: 'Flooring', item: 'Flooring', amount: '10000', field: 'garage_manual' },
            { display: 'Sink', item: 'Sink', amount: '3000', field: 'garage_manual', postContract: true },
          ],
        },
      });
    }));

    it('getRemoveManualExtra', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        extras_manual: {
          garage: [
            { display: 'Flooring', item: 'Flooring', amount: '10000', field: 'garage_manual' },
            { display: 'Sink', item: 'Sink', amount: '3000', field: 'garage_manual' },
          ],
        },
      });
      const updateManualExtras = service.getRemoveManualExtra(spec, 'garage', 0);
      expect(updateManualExtras).toEqual({
        extras_manual: {
          section_details: ' ',
          garage: [{ display: 'Sink', item: 'Sink', amount: '3000', field: 'garage_manual' }],
        },
      });
    }));

    it('getDismissCustomValueChange', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        custom_value: {
          garage: {
            garageColour: { dismissed: false, value: 'Rainbow' },
          },
          mainBathroom: {
            shower: { dismissed: true, value: 'deluxe' },
          },
        },
      });
      const updateCustomValues = service.getDismissCustomValueChange(spec, 'garage', 'garageColour');
      expect(updateCustomValues).toEqual({
        custom_value: {
          garage: { garageColour: { dismissed: true, value: 'Rainbow' } },
          mainBathroom: {
            shower: { dismissed: true, value: 'deluxe' },
          },
        },
      });
    }));

    it('getHighlightFieldChange_highlight_field', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        highlighted_notes: {
          garage: {
            garageColour: true,
          },
        },
      });
      const updateHighlightedFields = service.getHighlightFieldChanges(spec, 'mainBathroom', 'shower');
      expect(updateHighlightedFields).toEqual({
        highlighted_notes: {
          // @ts-ignore
          mainBathroom: {
            shower: true,
          },
        },
      });
    }));

    it('getHighlightFieldChange_unhighlight_field', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        highlighted_notes: {
          garage: {
            garageColour: true,
          },
          mainBathroom: {
            shower: true,
          },
        },
      });
      const updateHighlightedFields = service.getHighlightFieldChanges(spec, 'mainBathroom', 'shower');
      expect(updateHighlightedFields).toEqual({
        highlighted_notes: {
          // @ts-ignore
          mainBathroom: {
            shower: false,
          },
        },
      });
    }));

    it('getHideSectionChanges', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        extras: {
          garage: [
            {
              amount: 0,
              display: 'Garage attic ladder',
              field: 'atticLadder',
            },
          ],
        },
        extras_manual: {
          garage: [
            {
              amount: '455.40',
              item: 'Custom opener',
            },
          ],
        },
        extras_optional: {
          garage: [
            {
              amount: '455.40',
              item: 'Garage Option',
            },
          ],
        },
        hiddenSections: {
          ensuite: false,
          garage: false,
          joinery: true,
        },
      });
      const updateHideSection = service.getHideSectionChanges(spec, 'garage');
      expect(updateHideSection).toEqual({
        extras: {
          garage: [],
        },
        extras_manual: {
          garage: [],
        },
        extras_optional: {
          garage: [],
        },
        hiddenSections: {
          garage: true,
        },
      });
    }));

    it('getShowSectionChanges', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const updateShowSection = service.getShowSectionChanges('garage');
      expect(updateShowSection).toEqual({
        extras: {
          // @ts-ignore
          garage: [{ dummy: true }],
        },
        extras_manual: {
          // @ts-ignore
          garage: [{ dummy: true }],
        },
        extras_optional: {
          // @ts-ignore
          garage: [{ dummy: true }],
        },
        hiddenSections: {
          // @ts-ignore
          garage: false,
        },
      });
    }));

    it('getHideSubSectionChanges', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        extras: {
          mainBathroom: [
            {
              amount: 500,
              display: 'Enduro Shield',
              field: 'enduroShield',
            },
          ],
        },
        hiddenSections: {
          section_details: false,
        },
      });
      const updateHideSubSection = service.getHideSubSectionChanges(spec, 'mainBathroom', 'showerSubTitle');
      expect(updateHideSubSection).toEqual({
        hiddenSections: {
          mainBathroom: {
            showerSubTitle: true,
          },
        },
      });
    }));

    it('getShowSubSectionChanges', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const updateShowSubSection = service.getShowSubSectionChanges('mainBathroom', 'showerSubTitle');
      expect(updateShowSubSection).toEqual({
        hiddenSections: {
          // @ts-ignore
          mainBathroom: { showerSubTitle: false },
        },
      });
    }));

    it('getAddNewSectionChanges_duplicate_section', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const NEW_SECTION = mergeRight(garageConfig, {
        name: 'garage_22',
        title: 'New Garage',
        type: 'DUPLICATE',
      });
      const addNewSection = service.getAddNewSectionChanges('garage_22', NEW_SECTION, ORDER_LIST);

      expect(addNewSection).toEqual({
        // @ts-ignore
        garage_22: {
          ...NEW_SECTION,
        },
        custom_sections: {
          // @ts-ignore
          garage_22: NEW_SECTION.title,
        },
        sort: {
          orderList: ORDER_LIST,
        },
      });
    }));

    it('getAddNewSectionChanges_free_text_section', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const NEW_SECTION = {
        id: 22,
        name: 'office_22',
        title: 'Office',
        canHide: true,
        hasExtras: false,
        fields: [
          { name: `office_22_PmNote`, display: 'PM Notes', type: 'textarea' },
          {
            name: 'attachImage_additional',
            display: '',
            type: 'textarea',
            minRows: 13,
            maxRows: 15,
          },
        ],
        type: 'FREE',
      };
      const addNewSection = service.getAddNewSectionChanges('office_22', NEW_SECTION, ORDER_LIST);

      expect(addNewSection).toEqual({
        // @ts-ignore
        office_22: {
          ...NEW_SECTION,
        },
        custom_sections: {
          // @ts-ignore
          office_22: NEW_SECTION.title,
        },
        sort: {
          orderList: ORDER_LIST,
        },
      });
    }));

    it('getUpdateSectionChanges', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const updateSection = service.getUpdateSectionChanges('mainBathroom', { amount: 100 });
      expect(updateSection).toEqual({
        // @ts-ignore
        mainBathroom: { amount: 100 },
      });
    }));

    it('getUpdateSpecOrderChanges', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const ORDER_LIST = ['section_details', 'planning'];
      const updateOrder = service.getUpdateSpecOrderChanges(ORDER_LIST);
      expect(updateOrder).toEqual({
        // @ts-ignore
        sort: { orderList: ORDER_LIST },
      });
    }));

    it('getUpdateSectionNameChanges', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const updateName = service.getUpdateSectionNameChanges('mainBathroom', 'Master Bathroom');
      expect(updateName).toEqual({
        // @ts-ignore
        mainBathroom: {
          title: 'Master Bathroom',
        },
      });
    }));

    it('getUpdateSubSectionNameChanges', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const updateName = service.getUpdateSubSectionNameChanges('mainBathroom', 'showerSubTitle', 'Master Shower');
      expect(updateName).toEqual({
        // @ts-ignore
        custom_fields: {
          // @ts-ignore
          mainBathroom: {
            showerSubTitle: 'Master Shower',
          },
        },
      });
    }));

    it('getUpdateExtrasChanges_normal_extra', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        extras: {
          section_details: ' ',
          garage: [
            {
              amount: 0,
              display: 'Garage attic ladder',
              field: 'atticLadder',
            },
          ],
          mainBathroom: [
            {
              amount: 5000,
              display: 'Enduro Shield',
              field: 'enduroShield',
            },
          ],
        },
      });

      const extras = [
        {
          amount: 100,
          display: 'Garage attic ladder',
          field: 'atticLadder',
          gross: 100,
          gst: 15,
          item: 'Yes',
          net: 85,
          section: 'garage',
          type: 'extras',
          modified: true,
          _amount: 100,
        },
      ];

      const allExtras = [
        {
          amount: 0,
          display: 'Garage attic ladder',
          field: 'atticLadder',
          section: 'garage',
        },
        {
          amount: 5000,
          display: 'Enduro Shield',
          field: 'enduroShield',
          section: 'mainBathroom',
        },
      ];

      const extrasChanges = service.getUpdateExtrasChanges(spec, allExtras, extras);
      // for now, because the change is at a nested level (extras/garage) we need to include all other child nodes of extras
      expect(extrasChanges).toEqual({
        // @ts-ignore
        extras: {
          section_details: ' ',
          garage: [
            {
              amount: 100,
              display: 'Garage attic ladder',
              field: 'atticLadder',
              _amount: 100,
              includeInBuildPrice: false,
            },
          ],
          mainBathroom: [
            {
              amount: 5000,
              display: 'Enduro Shield',
              field: 'enduroShield',
            },
          ],
        },
        extras_manual: { section_details: ' ' },
        extras_optional: { section_details: ' ' },
      });
    }));

    it('getUpdateExtrasChanges_manual_extra_and_optional_extra', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        extras: {
          section_details: ' ',
          kitchen: [{ display: 'Zeon Kitchen mixer', amount: 75, field: 'kitchenMixer' }],
        },
        extras_manual: {
          section_details: ' ',
          kitchen: [{ display: 'AC01', amount: '2500', field: 'kitchen_manual' }],
        },
        extras_optional: {
          section_details: ' ',
          electrical: [
            {
              display: 'Heat Pump 6.0kw ASTG18KMTC',
              quantity: 4200,
              amount: 14901600,
              field: 'Electrical_optional',
            },
          ],
        },
      });

      const allExtras = [
        {
          display: 'Zeon Kitchen mixer',
          field: 'kitchenMixer',
          section: 'kitchen',
        },
        {
          display: 'AC01',
          field: 'kitchen_manual',
          section: 'kitchen',
        },
        {
          display: 'Heat Pump 6.0kw ASTG18KMTC',
          field: 'Electrical_optional',
          section: 'electrical',
        },
      ];

      const extras = [
        {
          amount: 0,
          display: 'Zeon Kitchen mixer',
          field: 'kitchenMixer',
          item: 'zeon',
          section: 'kitchen',
          type: 'extras',
          includeInBuildPrice: true,
          _amount: 75,
          modified: true,
        },
        {
          amount: 0,
          display: 'AC01',
          field: 'kitchen_manual',
          item: 'AC01',
          section: 'kitchen',
          type: 'extras_manual',
          includeInBuildPrice: true,
          _amount: '2500',
          modified: true,
        },
        {
          amount: 0,
          display: 'Heat Pump 6.0kw ASTG18KMTC',
          field: 'Electrical_optional',
          item: 'Heat Pump 6.0kw ASTG18KMTC',
          optional: true,
          quantity: 4200,
          section: 'electrical',
          type: 'extras_optional',
          includeInBuildPrice: true,
          _amount: 14901600,
          modified: true,
        },
      ];

      const extrasChanges = service.getUpdateExtrasChanges(spec, allExtras, extras);
      // for now, because the change is at a nested level (extras/garage) we need to include all other child nodes of extras
      expect(extrasChanges).toEqual({
        // @ts-ignore
        extras: {
          section_details: ' ',
          kitchen: [
            {
              display: 'Zeon Kitchen mixer',
              field: 'kitchenMixer',
              amount: 0,
              _amount: 75,
              includeInBuildPrice: true,
            },
          ],
        },
        extras_manual: {
          section_details: ' ',
          kitchen: [
            {
              display: 'AC01',
              field: 'kitchen_manual',
              amount: 0,
              _amount: '2500',
              includeInBuildPrice: true,
            },
          ],
        },
        extras_optional: {
          section_details: ' ',
          electrical: [
            {
              display: 'Heat Pump 6.0kw ASTG18KMTC',
              field: 'Electrical_optional',
              amount: 0,
              _amount: 14901600,
              includeInBuildPrice: true,
              optional: true,
              quantity: 4200,
            },
          ],
        },
      });
    }));

    it('getUpdateExtrasChanges_cladding_extra', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        extras: {
          section_details: ' ',
          'cladding-additional^0': [
            {
              amount: 400,
              display: 'Mortar coloured to match',
              field: 'mortarColour',
            },
          ],
          'cladding-additional^1': [
            {
              amount: 400,
              display: 'Mortar coloured to match',
              field: 'mortarColour',
            },
          ],
        },
      });

      const extras = [
        {
          amount: 500,
          display: 'Mortar coloured to match',
          field: 'mortarColour',
          gross: 500,
          gst: 75,
          item: 'Yes',
          net: 425,
          section: 'cladding-additional^0',
          type: 'extras',
          modified: true,
          _amount: 500,
        },
      ];

      const allExtras = [
        {
          amount: 400,
          display: 'Mortar coloured to match',
          field: 'mortarColour',
          gross: 400,
          gst: 60,
          item: 'Yes',
          net: 340,
          section: 'cladding-additional^0',
          type: 'extras',
          modified: true,
          _amount: 400,
        },
        {
          amount: 400,
          display: 'Mortar coloured to match',
          field: 'mortarColour',
          gross: 400,
          gst: 60,
          item: 'Yes',
          net: 340,
          section: 'cladding-additional^1',
          type: 'extras',
          modified: true,
          _amount: 400,
        },
      ];

      const extrasChanges = service.getUpdateExtrasChanges(spec, allExtras, extras);
      // for now, because the change is at a nested level (extras/garage) we need to include all other child nodes of extras
      expect(extrasChanges).toEqual({
        // @ts-ignore
        extras: {
          section_details: ' ',
          'cladding-additional^0': [
            {
              amount: 500,
              display: 'Mortar coloured to match',
              field: 'mortarColour',
              _amount: 500,
              includeInBuildPrice: false,
            },
          ],
          'cladding-additional^1': [
            {
              amount: 500,
              display: 'Mortar coloured to match',
              field: 'mortarColour',
              _amount: 500,
              includeInBuildPrice: false,
            },
          ],
        },
        extras_manual: { section_details: ' ' },
        extras_optional: { section_details: ' ' },
      });
    }));

    it('getUpdateExtrasChanges_optional_extras_in_the_same_section', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        extras_optional: {
          electrical: [
            {
              display: 'Heat Pump 3.2kw ASTG09KMTC',
              field: 'Electrical_optional',
              amount: 0,
              _amount: 2920,
              includeInBuildPrice: true,
              section: 'electrical',
              type: 'extras_optional',
              fieldIndex: 0,
              gross: 0,
              net: 0,
              gst: 0,
            },
            {
              display: 'Heat Pump 3.2kw ASTG09KMTC',
              item: 'Heat Pump 3.2kw ASTG09KMTC',
              postContract: false,
              quantity: 1,
              amount: 2920,
              optional: true,
              field: 'Electrical_optional',
              addedStatus: 'Quote',
              section: 'electrical',
              type: 'extras_optional',
              fieldIndex: 1,
              gross: 2920,
              net: 2539.130434782609,
              gst: 380.869565217391,
            },
            {
              display: 'Heat Pump 3.7kw ASTG12KMTC',
              item: 'Heat Pump 3.7kw ASTG12KMTC',
              postContract: false,
              quantity: 1,
              amount: 2920,
              optional: true,
              field: 'Electrical_optional',
              addedStatus: 'Quote',
              section: 'electrical',
              type: 'extras_optional',
              fieldIndex: 2,
              gross: 2920,
              net: 2539.130434782609,
              gst: 380.869565217391,
            },
          ],
          houseSize_hint: 'SQM over frame',
          section_details: ' ',
          undefined: '',
          undefined_hint: null,
        },
      });
      const allExtras = [
        {
          display: 'Heat Pump 3.2kw ASTG09KMTC',
          item: 'Heat Pump 3.2kw ASTG09KMTC',
          postContract: false,
          quantity: 1,
          amount: 0,
          optional: true,
          field: 'Electrical_optional',
          addedStatus: 'Quote',
          section: 'electrical',
          type: 'extras_optional',
          fieldIndex: 0,
          gross: 2920,
          net: 2539.130434782609,
          gst: 380.869565217391,
          includeInBuildPrice: true,
          _amount: 2920,
          modified: true,
        },
        {
          display: 'Heat Pump 3.2kw ASTG09KMTC',
          item: 'Heat Pump 3.2kw ASTG09KMTC',
          postContract: false,
          quantity: 1,
          amount: 2920,
          optional: true,
          field: 'Electrical_optional',
          addedStatus: 'Quote',
          section: 'electrical',
          type: 'extras_optional',
          fieldIndex: 1,
          gross: 2920,
          net: 2539.130434782609,
          gst: 380.869565217391,
        },
        {
          display: 'Heat Pump 3.7kw ASTG12KMTC',
          item: 'Heat Pump 3.7kw ASTG12KMTC',
          postContract: false,
          quantity: 1,
          amount: 2920,
          optional: true,
          field: 'Electrical_optional',
          addedStatus: 'Quote',
          section: 'electrical',
          type: 'extras_optional',
          fieldIndex: 2,
          gross: 2920,
          net: 2539.130434782609,
          gst: 380.869565217391,
        },
      ];
      const extras = [
        {
          display: 'Heat Pump 3.2kw ASTG09KMTC',
          item: 'Heat Pump 3.2kw ASTG09KMTC',
          postContract: false,
          quantity: 1,
          amount: 0,
          optional: true,
          field: 'Electrical_optional',
          addedStatus: 'Quote',
          section: 'electrical',
          type: 'extras_optional',
          fieldIndex: 0,
          gross: 2920,
          net: 2539.130434782609,
          gst: 380.869565217391,
          includeInBuildPrice: true,
          _amount: 2920,
          modified: true,
        },
      ];
      const extrasChanges = service.getUpdateExtrasChanges(spec, allExtras, extras);
      expect(extrasChanges).toEqual({
        extras: {
          section_details: ' ',
        },
        extras_manual: {
          section_details: ' ',
        },
        extras_optional: {
          electrical: [
            {
              display: 'Heat Pump 3.2kw ASTG09KMTC',
              field: 'Electrical_optional',
              amount: 0,
              _amount: 2920,
              includeInBuildPrice: true,
              postContract: false,
              quantity: 1,
              optional: true,
              addedStatus: 'Quote',
            },
            {
              display: 'Heat Pump 3.2kw ASTG09KMTC',
              item: 'Heat Pump 3.2kw ASTG09KMTC',
              postContract: false,
              quantity: 1,
              amount: 2920,
              optional: true,
              field: 'Electrical_optional',
              addedStatus: 'Quote',
              section: 'electrical',
              type: 'extras_optional',
              fieldIndex: 1,
              gross: 2920,
              net: 2539.130434782609,
              gst: 380.869565217391,
            },
            {
              display: 'Heat Pump 3.7kw ASTG12KMTC',
              item: 'Heat Pump 3.7kw ASTG12KMTC',
              postContract: false,
              quantity: 1,
              amount: 2920,
              optional: true,
              field: 'Electrical_optional',
              addedStatus: 'Quote',
              section: 'electrical',
              type: 'extras_optional',
              fieldIndex: 2,
              gross: 2920,
              net: 2539.130434782609,
              gst: 380.869565217391,
            },
          ],
          houseSize_hint: 'SQM over frame',
          section_details: ' ',
          undefined: '',
          undefined_hint: null,
        },
      });
    }));

    it('getUpdateMultiFieldChanges_when_adding_first_field', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        details: {},
      });
      const ADD_NEW_FIELD_PAYLOAD = { 0: 'email@one.com' };
      const addEmailChanges = service.getUpdateMultiFieldChanges(spec, 'details', 'emails', ADD_NEW_FIELD_PAYLOAD);
      expect(addEmailChanges).toEqual({
        details: {
          emails: ['email@one.com'],
        },
      });
    }));

    it('getUpdateMultiFieldChanges_when_adding_field', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        details: {
          emails: ['email@one.com', 'email@two.com'],
        },
      });
      // TO add a field, we use an object where the key is the index of the new item and value is an empty string
      const ADD_NEW_FIELD_PAYLOAD = { 2: '' };
      const addEmailChanges = service.getUpdateMultiFieldChanges(spec, 'details', 'emails', ADD_NEW_FIELD_PAYLOAD);
      expect(addEmailChanges).toEqual({
        details: {
          emails: ['email@one.com', 'email@two.com', ''],
        },
      });
    }));

    it('getUpdateMultiFieldChanges_when_updating_field', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        details: {
          emails: ['email@one.com', 'email@two.com', 'email@three.com'],
        },
      });

      const UPDATE_FIELD_PAYLOAD = { 1: 'email@two.co.nz' };
      const addEmailChanges = service.getUpdateMultiFieldChanges(spec, 'details', 'emails', UPDATE_FIELD_PAYLOAD);
      expect(addEmailChanges).toEqual({
        details: {
          emails: ['email@one.com', 'email@two.co.nz', 'email@three.com'],
        },
      });
    }));

    it('getRemoveMultiFieldChanges_when_updating_field', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const spec = getTestSpec(SPEC, {
        contact_details: {
          emails: ['email@one.com', 'email@two.com', 'email@three.com'],
        },
      });

      const removeEmailChanges = service.getRemoveMultiFieldChanges(spec, 'contact_details', 'emails', 1);
      expect(removeEmailChanges).toEqual({
        contact_details: {
          emails: ['email@one.com', 'email@three.com'],
        },
      });
    }));

    it('getUpdateQuoteChanges', inject([SpecFormatterService], (service: SpecFormatterService) => {
      const quoteChanges = service.getUpdateQuoteChanges({ amount: 100 });
      expect(quoteChanges.quote.amount).toEqual(100);
      expect(quoteChanges.quote.lastModified).toBeDefined();
    }));
  });

  describe('other methods', () => {
    it('addSectionsFromSpec_no_sort', () => {
      const spec = getTestSpec(SPEC, {
        custom_sections: {
          office_22: 'Office',
        },
        office_22: {
          id: 22,
          name: 'office_22',
          title: 'Office',
          canHide: true,
          hasExtras: true,
          fields: [
            { name: 'office_22PmNote', display: 'PM Notes', type: 'textarea' },
            { name: 'attachImage_additional', display: '', type: 'textarea', minRows: 13, maxRows: 15 },
          ],
          type: 'FREE',
        },
      });
      const service: SpecFormatterService = TestBed.inject(SpecFormatterService);
      const sectionList = service.combineUserAndDefinedSections(spec, []);
      expect(sectionList).toEqual([spec.office_22]);
    });

    it('addSectionsFromSpec_with_sort', () => {
      const spec = getTestSpec(SPEC, {
        custom_sections: {
          office_22: 'Office',
        },
        office_22: {
          id: 22,
          name: 'office_22',
          title: 'Office',
          canHide: true,
          hasExtras: true,
          fields: [
            { name: 'office_22PmNote', display: 'PM Notes', type: 'textarea' },
            { name: 'attachImage_additional', display: '', type: 'textarea', minRows: 13, maxRows: 15 },
          ],
          type: 'FREE',
        },
        sort: { orderList: ['office_22', 'planning'] },
      });
      const service: SpecFormatterService = TestBed.inject(SpecFormatterService);
      const sectionList = service.combineUserAndDefinedSections(spec, [{ name: 'planning' }]);
      expect(sectionList).toEqual([spec.office_22, { name: 'planning', type: 'DEFAULT' }]);
    });
  });

  describe('getClientChanges', () => {
    it('should return object with all relevant client changes', () => {
      const service: SpecFormatterService = TestBed.inject(SpecFormatterService);
      const clientChanges = service.getClientChanges({ name: 'client' }, { client: 'TEST', garageColour: 'rainbow' });
      expect(clientChanges).toEqual({
        client: 'TEST',
      });
    });
    it('should return object with all relevant client changes', () => {
      const service: SpecFormatterService = TestBed.inject(SpecFormatterService);
      const clientChanges = service.getClientChanges({ name: 'consultantEmail' }, { consultantEmail: 'TEST', garageColour: 'rainbow' });
      expect(clientChanges).toEqual({
        consultantEmail: 'TEST',
      });
    });
    it('should return object with all relevant client changes', () => {
      const service: SpecFormatterService = TestBed.inject(SpecFormatterService);
      const clientChanges = service.getClientChanges({ name: 'consultantName' }, { consultantName: 'TEST', garageColour: 'rainbow' });
      expect(clientChanges).toEqual({
        consultantName: 'TEST',
      });
    });
    it('should return object with all relevant client changes', () => {
      const service: SpecFormatterService = TestBed.inject(SpecFormatterService);
      const clientChanges = service.getClientChanges({ name: 'lot' }, { lot: 'TEST', garageColour: 'rainbow' });
      expect(clientChanges).toEqual({
        lot: 'TEST',
      });
    });
    it('should return object with all relevant client changes', () => {
      const service: SpecFormatterService = TestBed.inject(SpecFormatterService);
      const clientChanges = service.getClientChanges(
        { name: 'projectManagerEmail' },
        { projectManagerEmail: 'TEST', garageColour: 'rainbow' }
      );
      expect(clientChanges).toEqual({
        projectManagerEmail: 'TEST',
      });
    });
    it('should return object with all relevant client changes', () => {
      const service: SpecFormatterService = TestBed.inject(SpecFormatterService);
      const clientChanges = service.getClientChanges(
        { name: 'projectManagerName' },
        { projectManagerName: 'TEST', garageColour: 'rainbow' }
      );
      expect(clientChanges).toEqual({
        projectManagerName: 'TEST',
      });
    });
    it('should return object with all relevant client changes', () => {
      const service: SpecFormatterService = TestBed.inject(SpecFormatterService);
      const clientChanges = service.getClientChanges({ name: 'scheme' }, { scheme: 'TEST', garageColour: 'rainbow' });
      expect(clientChanges).toEqual({
        scheme: 'TEST',
      });
    });
    it('should return object with all relevant client changes', () => {
      const service: SpecFormatterService = TestBed.inject(SpecFormatterService);
      const clientChanges = service.getClientChanges({ name: 'subdivision' }, { subdivision: 'TEST', garageColour: 'rainbow' });
      expect(clientChanges).toEqual({
        subdivision: 'TEST',
      });
    });
  });
});
