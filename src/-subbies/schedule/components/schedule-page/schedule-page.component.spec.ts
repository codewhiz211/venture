import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { jobServiceStub, subbieServiceStub } from '@shared/test/stubs';

import { AuthService } from '@auth/services/auth.service';
import { JobsService } from '@jobs/services/jobs.service';
import { MockAuthService } from '@shared/test/mock-services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SchedulePageComponent } from './schedule-page.component';
import { SubbieJobService } from '@services/spec/subbie-job.service';

describe('SchedulePageComponent', () => {
  let component: SchedulePageComponent;
  let fixture: ComponentFixture<SchedulePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulePageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: JobsService, useValue: jobServiceStub },
        { provide: AuthService, useClass: MockAuthService },
        { provide: SubbieJobService, useValue: subbieServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
