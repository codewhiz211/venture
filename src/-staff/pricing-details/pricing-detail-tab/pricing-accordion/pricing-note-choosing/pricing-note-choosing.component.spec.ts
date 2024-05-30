import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, formBuilderStub, noteServiceStub } from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoteService } from 'src/-staff/services/note.service';
import { PricingNoteChoosingComponent } from './pricing-note-choosing.component';

describe('PricingNoteChoosingComponent', () => {
  let component: PricingNoteChoosingComponent;
  let fixture: ComponentFixture<PricingNoteChoosingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PricingNoteChoosingComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: NoteService, useValue: noteServiceStub },
        { provide: FormBuilder, useValue: formBuilderStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingNoteChoosingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
