import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoteComponent } from './note.component';
import { dialogServiceStub } from '@shared/test/stubs';

describe('NoteComponent', () => {
  let component: NoteComponent;
  let fixture: ComponentFixture<NoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoteComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: DialogService, useValue: dialogServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
