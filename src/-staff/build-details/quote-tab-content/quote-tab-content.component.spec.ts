import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, specActiveServiceStub, specServiceStub } from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { QuoteTabContentComponent } from './quote-tab-content.component';
import { SPEC } from '@shared/export/spec.fortest';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecService } from '@services/spec/spec.service';

describe('QuoteTabContentComponent', () => {
  let component: QuoteTabContentComponent;
  let fixture: ComponentFixture<QuoteTabContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuoteTabContentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SpecService, useValue: specServiceStub },
        { provide: SpecActiveService, useValue: specActiveServiceStub },
        { provide: DialogService, useValue: dialogServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteTabContentComponent);
    component = fixture.componentInstance;
    component.data = { spec: { ...SPEC, layout: { bedrooms: 2 } } };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
