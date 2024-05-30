import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { JobsBoardComponent } from './jobs-board.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PreferenceService } from '@services/preference.service';

describe('JobsBoardComponent', () => {
  let component: JobsBoardComponent;
  let fixture: ComponentFixture<JobsBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobsBoardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: PreferenceService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsBoardComponent);
    component = fixture.componentInstance;
    component.jobs = [];
    component.title = '';
    component.titleIcon = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
