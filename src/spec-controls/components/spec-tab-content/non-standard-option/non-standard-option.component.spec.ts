import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, specServiceStub } from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NonStandardOptionComponent } from './non-standard-option.component';
import { SpecService } from '@services/spec/spec.service';

describe('NonStandardOptionComponent', () => {
  let component: NonStandardOptionComponent;
  let fixture: ComponentFixture<NonStandardOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonStandardOptionComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: SpecService, useValue: specServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonStandardOptionComponent);
    component = fixture.componentInstance;
    component.data = { customValues: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
