import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PricingOptionSummarySectionComponent } from './pricing-option-summary-section.component';
import { PricingService } from '@services/spec/pricing.service';
import { pricingServiceStub } from '@shared/test/stubs';

describe('PricingOptionSummarySectionComponent', () => {
  let component: PricingOptionSummarySectionComponent;
  let fixture: ComponentFixture<PricingOptionSummarySectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PricingOptionSummarySectionComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: PricingService, useValue: pricingServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingOptionSummarySectionComponent);
    component = fixture.componentInstance;
    component.summaryHeader = {};
    component.optionId = 1;
    component.uid = '-MqLjcFN8DeoauMkJU3q';
    component.client = {
      client: 'Jenny',
      lot: 'L123 -23',
      subdivision: 'Yunxi',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
