import { AuthService } from '@auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { JobsService } from './jobs.service';
import { MockAuthService } from '@shared/test/mock-services';
import { TestBed } from '@angular/core/testing';
import { httpClientStub } from '@shared/test/stubs';

describe('JobsService', () => {
  let service: JobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientStub },
        { provide: AuthService, useClass: MockAuthService },
      ],
    });
    service = TestBed.inject(JobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
