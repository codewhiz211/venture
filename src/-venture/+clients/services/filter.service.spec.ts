import { HttpClient } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';

import { FilterService } from './filter.service';

const httpClientStub = { list: () => {} };

describe('FilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          FilterService,
          { provide: HttpClient, useValue: httpClientStub }
        ]
    });
  });


  it('should be created', inject([FilterService], (service: FilterService) => {
    expect(service).toBeTruthy();
  }));

  it('any is TRUE, return empty array', inject([FilterService], (service: FilterService) => {
    const options = { any: true };
    const result = service.filterOutUnSelected(options);
    expect(result.length).toEqual(0);
  }));

  it('if a key is true, return it', inject([FilterService], (service: FilterService) => {
    const options = { any: false, 'golden sands': true };
    const result = service.filterOutUnSelected(options);
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual('golden sands');
  }));

  it('return all keys that are true', inject([FilterService], (service: FilterService) => {
    const options = { any: false, 'golden sands': true, 'the lakes': true };
    const result = service.filterOutUnSelected(options);
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('golden sands', 'the lakes');
  }));


  it('removes keys that have been deselected', inject([FilterService], (service: FilterService) => {
    const options = { any: false, 'golden sands': true, 'the lakes': false };
    const result = service.filterOutUnSelected(options);
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual('golden sands');
  }));

});
