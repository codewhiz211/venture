import { httpClientStub, matSnackBarStub } from '@shared/test/stubs';

import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from './note.service';
import { TestBed } from '@angular/core/testing';

describe('NoteService', () => {
  let service: NoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: matSnackBarStub },
        { provide: HttpClient, useValue: httpClientStub },
      ],
    });
    service = TestBed.inject(NoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
