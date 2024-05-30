import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { JobsService } from '@jobs/services/jobs.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ScheduleSummaryBoardComponent } from './schedule-summary-board.component';
import { jobServiceStub } from '@shared/test/stubs';

describe('ScheduleSummaryBoardComponent', () => {
  let component: ScheduleSummaryBoardComponent;
  let fixture: ComponentFixture<ScheduleSummaryBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleSummaryBoardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: JobsService, useValue: jobServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSummaryBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
