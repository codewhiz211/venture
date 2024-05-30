import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import {
  activedRouterStub,
  clientServiceStub,
  dialogServiceStub,
  headerMenuServiceStub,
  noteServiceStub,
  preferenceServiceStub,
  pricingServiceStub,
  routerStub,
  windowServiceStub,
} from '@shared/test/stubs';

import { ClientService } from '@clients/services/client.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { HeaderMenuService } from '@shell/header-menu.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoteService } from '../services/note.service';
import { PreferenceService } from '@services/preference.service';
import { PricingDetailsComponent } from './pricing-details.component';
import { PricingService } from '@services/spec/pricing.service';
import { WindowService } from '@services/window.service';

describe('PricingDetailsComponent', () => {
  let component: PricingDetailsComponent;
  let fixture: ComponentFixture<PricingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PricingDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ClientService, useValue: clientServiceStub },
        { provide: PreferenceService, useValue: preferenceServiceStub },
        { provide: PricingService, useValue: pricingServiceStub },
        { provide: WindowService, useValue: windowServiceStub },
        { provide: ActivatedRoute, useValue: activedRouterStub },
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: Router, useValue: routerStub },
        { provide: HeaderMenuService, useValue: headerMenuServiceStub },
        { provide: NoteService, useValue: noteServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
