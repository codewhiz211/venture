import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { clientServiceStub, preferenceServiceStub, pricingServiceStub, routerStub } from '@shared/test/stubs';

import { ClientService } from '@clients/services/client.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PreferenceService } from '@services/preference.service';
import { PricingPageComponent } from './pricing-page.component';
import { PricingService } from '@services/spec/pricing.service';
import { Router } from '@angular/router';

describe('PricingPageComponent', () => {
  let component: PricingPageComponent;
  let fixture: ComponentFixture<PricingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PricingPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ClientService, useValue: clientServiceStub },
        { provide: PreferenceService, useValue: preferenceServiceStub },
        { provide: PricingService, useValue: pricingServiceStub },
        { provide: Router, useValue: routerStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
