import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { JobStepContentLabel } from './job-step-label.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('JobStepContentLabel', () => {
  let component: JobStepContentLabel;
  let fixture: ComponentFixture<JobStepContentLabel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobStepContentLabel],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobStepContentLabel);
    component = fixture.componentInstance;
    component.step = {
      date: new Date(),
      message: '',
      comments: '',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
