import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, specServiceStub } from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { EditStatusComponent } from './edit-status.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SpecService } from '@services/spec/spec.service';

describe('EditStatusComponent', () => {
  let component: EditStatusComponent;
  let fixture: ComponentFixture<EditStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditStatusComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: SpecService, useValue: specServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStatusComponent);
    component = fixture.componentInstance;
    component.buildStatus = { status: 'Quote' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
