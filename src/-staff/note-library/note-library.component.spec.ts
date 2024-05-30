import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, noteServiceStub } from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoteLibraryComponent } from './note-library.component';
import { NoteService } from '../services/note.service';

describe('NoteLibraryComponent', () => {
  let component: NoteLibraryComponent;
  let fixture: ComponentFixture<NoteLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteLibraryComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: NoteService, useValue: noteServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
