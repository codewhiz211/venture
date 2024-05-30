import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { LoggerService } from '../logger.service';
import { SuggestionService } from './suggestion.service';
import { loggerServiceStub } from '../../test/stubs';

describe('SuggestionService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [SuggestionService, { provide: LoggerService, useValue: loggerServiceStub }],
      imports: [HttpClientTestingModule],
    })
  );

  it('should be created', () => {
    const service: SuggestionService = TestBed.get(SuggestionService);
    expect(service).toBeTruthy();
  });

  it('should be suggestion data', inject([SuggestionService], (service: SuggestionService) => {
    const show = service.getSuggestions();
    expect(show).not.toBeNull();
  }));

  it('should get suggestion list of data', inject([SuggestionService], (service: SuggestionService) => {
    let list: unknown = [];
    const listResponse = ['green', 'white', 'black'];
    const http = TestBed.get(HttpTestingController);
    service.getSuggestions().subscribe((value) => {
      list = value;
    });

    http.expectOne('/suggestion').flush(listResponse);
    expect(list).toEqual(listResponse);
  }));
});
