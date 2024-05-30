import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingTotalRowsComponent } from './pricing-total-rows.component';

describe('PricingTotalRowsComponent', () => {
  let component: PricingTotalRowsComponent;
  let fixture: ComponentFixture<PricingTotalRowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingTotalRowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingTotalRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
