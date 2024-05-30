import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { dialogServiceStub, subbieServiceStub, windowServiceStub } from '@shared/test/stubs';

import { AuthService } from '@auth/services/auth.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { JobSummaryCardComponent } from './job-summary-card.component';
import { MatMenuModule } from '@angular/material/menu';
import { MockAuthService } from '@shared/test/mock-services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubbieJobService } from '@services/spec/subbie-job.service';
import { WindowService } from '@services/window.service';
import { mockJob } from '@shared/test/mock-objects';

describe('JobSummaryCardComponent', () => {
  let component: JobSummaryCardComponent;
  let fixture: ComponentFixture<JobSummaryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobSummaryCardComponent],
      imports: [MatSnackBarModule, MatDialogModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: SubbieJobService, useValue: subbieServiceStub },
        { provide: WindowService, useValue: windowServiceStub },
        { provide: AuthService, useValue: MockAuthService },
        MatSnackBar,
        MatDialog,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSummaryCardComponent);
    component = fixture.componentInstance;
    component.job = mockJob;
    component.jobUid = '';
    component.subbieUid = '';
    component.specUid = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
