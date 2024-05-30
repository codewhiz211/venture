import { httpClientStub, matSnackBarStub } from '@shared/test/stubs';

import { AuthService } from '@auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MockAuthService } from '@shared/test/mock-services';
import { PreferenceService } from './preference.service';
import { TestBed } from '@angular/core/testing';

describe('PreferenceService', () => {
  let service: PreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: HttpClient, useValue: httpClientStub },
        { provide: MatSnackBar, useValue: matSnackBarStub },
      ],
    });
    service = TestBed.inject(PreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
