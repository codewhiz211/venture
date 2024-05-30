import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, drawerServiceStub, subbieServiceStub } from '@shared/test/stubs';

import { AuthService } from '@auth/services/auth.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '@shell/drawer/drawer.service';
import { MockAuthService } from '@shared/test/mock-services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ScheduleDateFormComponent } from './schedule-date-form.component';
import { SubbieJobService } from '@services/spec/subbie-job.service';

describe('ScheduleDateFormComponent', () => {
  let component: ScheduleDateFormComponent;
  let fixture: ComponentFixture<ScheduleDateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleDateFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DrawerService, useValue: drawerServiceStub },
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: AuthService, useClass: MockAuthService },
        { provide: SubbieJobService, useValue: subbieServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDateFormComponent);
    component = fixture.componentInstance;
    component.data = { start: '', end: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
