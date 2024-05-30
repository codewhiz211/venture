import { APP_CONFIG, VENTURE_CONFIG } from 'app.config';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { TestBed, async } from '@angular/core/testing';
import { headerMenuServiceStub, windowServiceStub } from '@shared/test/stubs';

import { AppComponent } from './app.component';
import { AuthService } from '@auth/services/auth.service';
import { HeaderMenuService } from '@shell/header-menu.service';
import { MockAuthService } from '@shared/test/mock-services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { WindowService } from '@services/window.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ServiceWorkerModule.register('/ngsw-worker.js', { enabled: VENTURE_CONFIG.serviceWorker })],
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: WindowService, useValue: windowServiceStub },
        { provide: HeaderMenuService, useValue: headerMenuServiceStub },
        SwUpdate,
        { provide: APP_CONFIG, useValue: VENTURE_CONFIG },
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
