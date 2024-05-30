import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingStatusComponent } from './pricing-status.component';

describe('PricingStatusComponent', () => {
  let component: PricingStatusComponent;
  let fixture: ComponentFixture<PricingStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
