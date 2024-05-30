import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, formBuilderStub, pricingServiceStub } from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PricingAccordionComponent } from './pricing-accordion.component';
import { PricingService } from '@services/spec/pricing.service';

const mockPricing = {
  uid: 'mockId',
  details: 'Upgrade Window Colour to Violet',
  field: 'windowColour',
  requestDate: 1638911606953,
  section: 'joinery',
  status: 'Requested',
  userEmail: 'junny185@126.com',
  userName: 'Jenny Yan',
  value: 'Voilet',
};

describe('PricingAccordionComponent', () => {
  let component: PricingAccordionComponent;
  let fixture: ComponentFixture<PricingAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PricingAccordionComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: PricingService, useValue: pricingServiceStub },
        { provide: DialogService, useValue: dialogServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingAccordionComponent);
    component = fixture.componentInstance;
    component.pricing = mockPricing;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
