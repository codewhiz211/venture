import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, noteServiceStub } from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoteService } from 'src/-staff/services/note.service';
import { NoteTableComponent } from './note-table.component';

describe('NoteTableComponent', () => {
  let component: NoteTableComponent;
  let fixture: ComponentFixture<NoteTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteTableComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: NoteService, useValue: noteServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
