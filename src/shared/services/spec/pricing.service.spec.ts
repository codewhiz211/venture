import { httpClientStub, matSnackBarStub, specServiceStub } from '@shared/test/stubs';

import { AuthService } from '@auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MockAuthService } from '@shared/test/mock-services';
import { PricingService } from './pricing.service';
import { SpecService } from './spec.service';
import { TestBed } from '@angular/core/testing';

describe('PricingService', () => {
  let service: PricingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientStub },
        { provide: AuthService, useClass: MockAuthService },
        { provide: SpecService, useValue: specServiceStub },
        { provide: MatSnackBar, useValue: matSnackBarStub },
      ],
    });
    service = TestBed.inject(PricingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
