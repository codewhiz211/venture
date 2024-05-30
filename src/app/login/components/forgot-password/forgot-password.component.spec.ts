import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { httpClientStub, localStorageStub, loggerServiceStub } from '@shared/test/stubs';

import { AuthService } from '@auth/services/auth.service';
import { ForgotPasswordComponent } from './forgot-password.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@services/local-storage.service';
import { LoggerService } from '@shared/services/logger.service';
import { MockAuthService } from '@shared/test/mock-services';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: HttpClient, useValue: httpClientStub },
        { provide: LocalStorageService, useValue: localStorageStub },
        { provide: LoggerService, useValue: loggerServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
