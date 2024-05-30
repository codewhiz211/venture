import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PricingService } from '@services/spec/pricing.service';
import { PricingSummaryBoardComponent } from './pricing-summary-board.component';
import { pricingServiceStub } from '@shared/test/stubs';

describe('PricingSummaryBoardComponent', () => {
  let component: PricingSummaryBoardComponent;
  let fixture: ComponentFixture<PricingSummaryBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PricingSummaryBoardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: PricingService, useValue: pricingServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingSummaryBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
