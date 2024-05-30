import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import {
  activedRouterStub,
  dialogServiceStub,
  folderServiceStub,
  matSnackBarStub,
  preferenceServiceStub,
  specActiveServiceStub,
  specServiceStub,
  trackingServiceStub,
  windowServiceStub,
} from '@shared/test/stubs';

import { ActivatedRoute } from '@angular/router';
import { BuildDetailsComponent } from './build-details.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { FolderService } from 'src/+files/src/services/folder.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PreferenceService } from '@services/preference.service';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecService } from '@services/spec/spec.service';
import { TrackingService } from '@services/spec/tracking.service';
import { WindowService } from '@services/window.service';

describe('BuildDetailsComponent', () => {
  let component: BuildDetailsComponent;
  let fixture: ComponentFixture<BuildDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuildDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: activedRouterStub },
        { provide: SpecService, useValue: specServiceStub },
        { provide: SpecActiveService, useValue: specActiveServiceStub },
        { provide: WindowService, useValue: windowServiceStub },
        { provide: PreferenceService, useValue: preferenceServiceStub },
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: MatSnackBar, useValue: matSnackBarStub },
        { provide: TrackingService, useValue: trackingServiceStub },
        { provide: FolderService, useValue: folderServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
