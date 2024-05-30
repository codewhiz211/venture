import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubmitPricingComponent } from './submit-pricing.component';
import { dialogServiceStub } from '@shared/test/stubs';

describe('SubmitPricingComponent', () => {
  let component: SubmitPricingComponent;
  let fixture: ComponentFixture<SubmitPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitPricingComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: DialogService, useValue: dialogServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
