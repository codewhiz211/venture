import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { appbarMenuServiceStub, jobServiceStub, subbieServiceStub } from '@shared/test/stubs';

import { AppBarMenuService } from '@shell/app-bar-menu.service';
import { AuthService } from '@auth/services/auth.service';
import { JobsPageComponent } from './jobs-page.component';
import { JobsService } from '@jobs/services/jobs.service';
import { MockAuthService } from '@shared/test/mock-services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubbieJobService } from '@services/spec/subbie-job.service';

describe('JobsPageComponent', () => {
  let component: JobsPageComponent;
  let fixture: ComponentFixture<JobsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobsPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: JobsService, useValue: jobServiceStub },
        { provide: SubbieJobService, useValue: subbieServiceStub },
        { provide: AuthService, useClass: MockAuthService },
        { provide: AppBarMenuService, useValue: appbarMenuServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
