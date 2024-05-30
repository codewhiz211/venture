import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, formBuilderStub } from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PngDetailsComponent } from './png-details.component';

describe('PngDetailsComponent', () => {
  let component: PngDetailsComponent;
  let fixture: ComponentFixture<PngDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PngDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: FormBuilder, useValue: formBuilderStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PngDetailsComponent);
    component = fixture.componentInstance;
    component.data = { rowFields: [], row: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
