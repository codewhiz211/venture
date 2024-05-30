import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { AuthService } from '@auth/services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@services/local-storage.service';
import { LoggerService } from '@shared/services/logger.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResetPasswordComponent } from './reset-password.component';
import { loggerServiceStub } from '@shared/test/stubs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  const httpClientStub = { list: () => {} };
  const authServiceStub = { verifyResetPasswordCode: () => Promise.resolve() };
  const localStorageStub = { save: () => {}, get: () => {}, remove: () => Promise.resolve() };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule, MatCardModule, MatFormFieldModule, MatIconModule, MatProgressSpinnerModule],
      providers: [
        { provide: HttpClient, useValue: httpClientStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: LocalStorageService, useValue: localStorageStub },
        { provide: LoggerService, useValue: loggerServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    component.authData = 'oobCode';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
