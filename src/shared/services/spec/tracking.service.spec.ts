import { matDialogStub, matSnackBarStub, windowServiceStub } from '@shared/test/stubs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestBed } from '@angular/core/testing';
import { TrackingService } from './tracking.service';
import { WindowService } from '@services/window.service';

describe('TrackingService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        TrackingService,
        { provide: MatSnackBar, useValue: matSnackBarStub },
        { provide: MatDialog, useValue: matDialogStub },
        { provide: WindowService, useValue: windowServiceStub },
      ],
      imports: [HttpClientTestingModule],
    })
  );

  it('should be created', () => {
    const service: TrackingService = TestBed.inject(TrackingService);
    expect(service).toBeTruthy();
  });

  it('should add change to list', () => {
    const service: TrackingService = TestBed.inject(TrackingService);

    service.addedChangesToTracking('emails-1', 'Contact Details', 'Email 1', undefined, { 0: 'rich@blacksandsolutions.co' });

    expect(service.getCurrentChanges).toEqual([
      { id: 'emails-1', section: 'Contact Details', field: 'Email 1', value: 'rich@blacksandsolutions.co' },
    ]);
  });

  it('should add change to existing list', () => {
    const service: TrackingService = TestBed.inject(TrackingService);

    service.addedChangesToTracking('emails-1', 'Contact Details', 'Email 1', undefined, { 0: 'rich@blacksandsolutions.co' });

    service.addedChangesToTracking('emails-2', 'Contact Details', 'Email 2', undefined, { 1: 'bob@blacksandsolutions.co' });

    expect(service.getCurrentChanges).toEqual([
      { id: 'emails-1', section: 'Contact Details', field: 'Email 1', value: 'rich@blacksandsolutions.co' },
      { id: 'emails-2', section: 'Contact Details', field: 'Email 2', value: 'bob@blacksandsolutions.co' },
    ]);
  });

  it('should return existing changes, when no new changes', () => {
    const service: TrackingService = TestBed.inject(TrackingService);

    service.addedChangesToTracking('emails-1', 'Contact Details', 'Email 1', undefined, { 0: 'rich@blacksandsolutions.co' });

    const emptyChange = { 1: '' };
    service.addedChangesToTracking('emails-2', 'Contact Details', 'Email 2', undefined, emptyChange);

    expect(service.getCurrentChanges).toEqual([
      { id: 'emails-1', section: 'Contact Details', field: 'Email 1', value: 'rich@blacksandsolutions.co' },
    ]);
  });
});
