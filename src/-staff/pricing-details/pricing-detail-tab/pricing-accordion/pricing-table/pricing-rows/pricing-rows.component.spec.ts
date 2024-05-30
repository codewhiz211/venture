import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PricingRowsComponent } from './pricing-rows.component';

describe('PricingRowsComponent', () => {
  let component: PricingRowsComponent;
  let fixture: ComponentFixture<PricingRowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PricingRowsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
