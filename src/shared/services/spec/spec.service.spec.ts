import {
  auditServiceStub,
  clientServiceStub,
  dialogServiceStub,
  matDialogStub,
  matSnackBarStub,
  sentryServiceStub,
  specActiveServiceStub,
  specDbServiceStub,
  specFormatterServiceStub,
  specUtilityServiceStub,
  suggestionServiceStub,
  windowServiceStub,
} from '@shared/test/stubs';

import { AuditService } from './audit.service';
import { AuthService } from '@auth/services/auth.service';
import { ClientService } from 'src/-venture/+clients/services/client.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MockAuthService } from '@shared/test/mock-services';
import { SentryService } from '@services/sentry.service';
import { SpecActiveService } from './spec.active.service';
import { SpecDBService } from './spec.db.service';
import { SpecFormatterService } from './spec.formatter.service';
import { SpecService } from './spec.service';
import { SpecUtilityService } from './spec.utility.service';
import { SuggestionService } from './suggestion.service';
import { TestBed } from '@angular/core/testing';
import { WindowService } from '@services/window.service';

describe('SpecService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: matSnackBarStub },
        { provide: SpecUtilityService, useValue: specUtilityServiceStub },
        { provide: SpecDBService, useValue: specDbServiceStub },
        { provide: AuditService, useValue: auditServiceStub },
        { provide: SuggestionService, useValue: suggestionServiceStub },
        { provide: ClientService, useValue: clientServiceStub },
        { provide: SpecActiveService, useValue: specActiveServiceStub },
        { provide: SpecFormatterService, useValue: specFormatterServiceStub },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatDialog, useValue: matDialogStub },
        { provide: WindowService, useValue: windowServiceStub },
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: SentryService, useValue: sentryServiceStub },
      ],
      imports: [HttpClientTestingModule],
    })
  );

  it('should be created', () => {
    const service: SpecService = TestBed.inject(SpecService);
    expect(service).toBeTruthy();
  });

  // TODO
  xit('updateSpec - if extras changes, show toast', () => {
    const service: SpecService = TestBed.inject(SpecService);

    const mockedFormatterService = TestBed.inject(SpecFormatterService);

    spyOn(mockedFormatterService, 'getUpdateSpecChanges').and.returnValue({
      extras: {
        garage: true,
      },
    });

    spyOn(service, 'showExtraAddedToast').and.callThrough();

    expect(service.showExtraAddedToast).toHaveBeenCalled();
  });

  // TODO
  xit('updateSpec - if there are no extras changes, dont show toast', () => {
    const service: SpecService = TestBed.inject(SpecService);

    const mockedFormatterService = TestBed.inject(SpecFormatterService);

    spyOn(mockedFormatterService, 'getUpdateSpecChanges').and.returnValue({});

    spyOn(service, 'showExtraAddedToast').and.callThrough();

    expect(service.showExtraAddedToast).not.toHaveBeenCalled();
  });

  xit('updateSpec - if there customValues they are added to updateChanges', () => {
    //expect(activeSpecService.updateSpec).toHaveBeenCalledWith(uid, customValues);
  });
});
