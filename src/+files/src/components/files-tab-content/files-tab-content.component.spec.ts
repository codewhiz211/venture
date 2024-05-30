import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { FilesTabContentComponent } from './files-tab-content.component';
import { FolderService } from '../../services/folder.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { folderServiceStub } from '@shared/test/stubs';

describe('FilesTabContentComponent', () => {
  let component: FilesTabContentComponent;
  let fixture: ComponentFixture<FilesTabContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilesTabContentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: FolderService, useValue: folderServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
