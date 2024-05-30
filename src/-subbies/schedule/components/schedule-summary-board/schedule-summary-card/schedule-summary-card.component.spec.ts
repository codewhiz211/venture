import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { JobsService } from '@jobs/services/jobs.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ScheduleSummaryCardComponent } from './schedule-summary-card.component';
import { jobServiceStub } from '@shared/test/stubs';
import { mockJob } from '@shared/test/mock-objects';

describe('ScheduleSummaryCardComponent', () => {
  let component: ScheduleSummaryCardComponent;
  let fixture: ComponentFixture<ScheduleSummaryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleSummaryCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: JobsService, useValue: jobServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSummaryCardComponent);
    component = fixture.componentInstance;
    component.jobSummary = { job: mockJob, jobUid: '', subbieUid: '', specUid: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
