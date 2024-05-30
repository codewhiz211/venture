import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, subbieServiceStub, windowServiceStub } from '@shared/test/stubs';

import { AuthService } from '@auth/services/auth.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { EmailService } from '@services/email.service';
import { JobVerificationComponent } from './job-verification.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MockAuthService } from '@shared/test/mock-services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SubbieJobService } from '@services/spec/subbie-job.service';
import { WindowService } from '@services/window.service';

describe('JobVerificationComponent', () => {
  let component: JobVerificationComponent;
  let fixture: ComponentFixture<JobVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobVerificationComponent],
      imports: [MatSnackBarModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: SubbieJobService, useValue: subbieServiceStub },
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: EmailService, useValue: {} },
        { provide: SpecActiveService, useValue: {} },
        { provide: WindowService, useValue: windowServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobVerificationComponent);
    component = fixture.componentInstance;
    component.data = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
