import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { JobDetailTabContentComponent } from './job-detail-tab-content.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('JobDetailTabContentComponent', () => {
  let component: JobDetailTabContentComponent;
  let fixture: ComponentFixture<JobDetailTabContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobDetailTabContentComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailTabContentComponent);
    component = fixture.componentInstance;
    const job = {
      jobStatus: 'completed',
      jobType: 'remedial',
      jobDetails: {
        description: '',
        subdivision: '',
        scheduleDate: '',
        projectManager: '',
        lotNumber: '',
      },
      projectManager: {
        projectManagerName: '',
        projectManagerEmail: '',
        projectManagerPhone: '',
      },
    };
    component.data = job;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
