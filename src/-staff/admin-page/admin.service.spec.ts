import { APP_CONFIG } from 'app.config';
import { AdminService } from './admin.service';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { httpClientStub } from '@shared/test/stubs';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientStub },
        { provide: APP_CONFIG, useValue: {} },
      ],
    });
    service = TestBed.inject(AdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
