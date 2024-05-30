import { TestBed, inject } from '@angular/core/testing';

import { ExtrasService } from './extras.service';
import { GstService } from './gst.service';
import { sectionConfig } from '@shared/config/spec-config';

const spec = {
  quote: {
    includeGst: false,
  },
  ['extras']: {
    ['layout']: [
      { amount: 10, postContract: true },
      { amount: 1, postContract: false },
    ],
    ['ensuite']: [
      { amount: 10, postContract: true },
      { amount: 1, postContract: false },
    ],
    ['ensuite_1']: [
      { amount: 10, postContract: true },
      { amount: 1, postContract: false },
    ],
  },
  ['extras_manual']: {
    ['garage']: [
      { amount: 10, postContract: true },
      { amount: 1, postContract: false },
    ],
  },
  ['extras_optional']: {
    ['kitchen']: [
      { amount: 10, postContract: true },
      { amount: 1, postContract: false },
    ],
  },
};
//@ts-ignore
const sections = [...sectionConfig, { name: 'ensuite_1' }];

describe('ExtrasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExtrasService, GstService],
    });
  });

  it('should be created', inject([ExtrasService], (service: ExtrasService) => {
    expect(service).toBeTruthy();
  }));

  it('getPostContractExtras should return only post contract extras', inject([ExtrasService], (service: ExtrasService) => {
    // TODO custom extras
    const extras = service.getPostContractExtras(spec, sections);
    expect(extras['ensuite'].extras.length).toEqual(1);
    expect(extras['ensuite_1'].extras.length).toEqual(1);
    expect(extras['layout'].extras.length).toEqual(1);
    expect(extras['garage'].extras.length).toEqual(1);
    expect(extras['kitchen'].extras.length).toEqual(1);

    expect(extras['ensuite'].extras[0].postContract).toEqual(true);
    expect(extras['ensuite_1'].extras[0].postContract).toEqual(true);
    expect(extras['layout'].extras[0].postContract).toEqual(true);
    expect(extras['garage'].extras[0].postContract).toEqual(true);
    expect(extras['kitchen'].extras[0].postContract).toEqual(true);
  }));

  it('getPostContractExtras should calculate total of only post contract extras', inject([ExtrasService], (service: ExtrasService) => {
    // TODO custom extras
    const extras = service.getPostContractExtras(spec, sections);
    expect(extras['ensuite'].total).toEqual(10);
    expect(extras['ensuite_1'].total).toEqual(10);
    expect(extras['layout'].total).toEqual(10);
    expect(extras['garage'].total).toEqual(10);
    expect(extras['kitchen'].total).toEqual(10);
  }));

  it('getPreContractExtras should return only pre contract extras', inject([ExtrasService], (service: ExtrasService) => {
    // TODO custom extras
    const extras = service.getPreContractExtras(spec, sections);
    expect(extras['ensuite'].extras.length).toEqual(1);
    expect(extras['ensuite_1'].extras.length).toEqual(1);
    expect(extras['layout'].extras.length).toEqual(1);
    expect(extras['garage'].extras.length).toEqual(1);
    expect(extras['kitchen'].extras.length).toEqual(1);

    expect(extras['ensuite'].extras[0].postContract).toEqual(false);
    expect(extras['ensuite_1'].extras[0].postContract).toEqual(false);
    expect(extras['layout'].extras[0].postContract).toEqual(false);
    expect(extras['garage'].extras[0].postContract).toEqual(false);
    expect(extras['kitchen'].extras[0].postContract).toEqual(false);
  }));

  it('getPreContractExtras should calculate total of only pre contract extras', inject([ExtrasService], (service: ExtrasService) => {
    // TODO custom extras
    const extras = service.getPreContractExtras(spec, sections);
    expect(extras['ensuite'].total).toEqual(1);
    expect(extras['ensuite_1'].total).toEqual(1);
    expect(extras['layout'].total).toEqual(1);
    expect(extras['garage'].total).toEqual(1);
    expect(extras['kitchen'].total).toEqual(1);
  }));
});
