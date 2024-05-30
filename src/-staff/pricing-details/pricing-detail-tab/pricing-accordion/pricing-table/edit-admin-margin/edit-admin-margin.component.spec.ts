import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, formBuilderStub } from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { EditAdminMarginComponent } from './edit-admin-margin.component';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditAdminMarginComponent', () => {
  let component: EditAdminMarginComponent;
  let fixture: ComponentFixture<EditAdminMarginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditAdminMarginComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FormBuilder, useValue: formBuilderStub },
        { provide: DialogService, useValue: dialogServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdminMarginComponent);
    component = fixture.componentInstance;
    component.data = { margin: 0.5 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
