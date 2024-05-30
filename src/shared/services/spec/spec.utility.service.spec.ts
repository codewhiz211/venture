import { TestBed, inject } from '@angular/core/testing';

import SPEC from '../../test/default-spec';
import { SpecUtilityService } from './spec.utility.service';
import { getTestSpec } from '@shared/test/test-utils';

describe('SpecUtilityService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [SpecUtilityService],
    })
  );

  it('should be created', () => {
    const service: SpecUtilityService = TestBed.get(SpecUtilityService);
    expect(service).toBeTruthy();
  });

  describe('addSlash', () => {
    // TODO need an example where slash gets added
    it('should create custom sections correctly', inject([SpecUtilityService], (service: SpecUtilityService) => {
      const spec = getTestSpec(SPEC, {
        custom_fields: { mainBathroom: { showerSubTitle: 'Deluxe Shower' } },
      });
      const customsSections = service.addSlash(spec);
      expect(customsSections).toEqual({ mainBathroom: { showerSubTitle: 'Deluxe Shower' } });
    }));
  });

  describe('removeSlash', () => {
    // TODO need an example where slash gets removed
    it('should create custom sections correctly', inject([SpecUtilityService], (service: SpecUtilityService) => {
      const spec = getTestSpec(SPEC, {
        custom_fields: { mainBathroom: { showerSubTitle: 'Deluxe Shower' } },
      });
      const customsSections = service.removeSlash(spec);
      expect(customsSections).toEqual({ mainBathroom: { showerSubTitle: 'Deluxe Shower' } });
    }));
  });
});
