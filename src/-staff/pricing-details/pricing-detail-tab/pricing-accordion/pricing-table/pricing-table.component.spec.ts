import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, pricingServiceStub } from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PricingService } from '@services/spec/pricing.service';
import { PricingTableComponent } from './pricing-table.component';

describe('PricingTableComponent', () => {
  let component: PricingTableComponent;
  let fixture: ComponentFixture<PricingTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PricingTableComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: PricingService, useValue: pricingServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingTableComponent);
    component = fixture.componentInstance;
    component.pricingSection = {};
    component.table = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
