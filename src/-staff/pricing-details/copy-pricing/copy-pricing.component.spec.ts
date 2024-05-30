import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CopyPricingComponent } from './copy-pricing.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { dialogServiceStub } from '@shared/test/stubs';

describe('CopyPricingComponent', () => {
  let component: CopyPricingComponent;
  let fixture: ComponentFixture<CopyPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CopyPricingComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: DialogService, useValue: dialogServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
