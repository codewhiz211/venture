import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, pricingServiceStub, routerStub, shareServiceStub } from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PricingDetailTabComponent } from './pricing-detail-tab.component';
import { PricingService } from '@services/spec/pricing.service';
import { Router } from '@angular/router';
import { ShareService } from '@services/spec/share.service';

describe('PricingDetailTabComponent', () => {
  let component: PricingDetailTabComponent;
  let fixture: ComponentFixture<PricingDetailTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PricingDetailTabComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: PricingService, useValue: pricingServiceStub },
        { provide: ShareService, useValue: shareServiceStub },
        { provide: Router, useValue: routerStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingDetailTabComponent);
    component = fixture.componentInstance;
    component.data = { pricing: {} };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
