import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { adminServiceStub, dialogServiceStub } from '@shared/test/stubs';

import { AdminService } from '../admin.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StaffManagementTabComponent } from './staff-management-tab.component';

describe('StaffManagementTabComponent', () => {
  let component: StaffManagementTabComponent;
  let fixture: ComponentFixture<StaffManagementTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StaffManagementTabComponent],
      providers: [
        { provide: AdminService, useValue: adminServiceStub },
        { provide: DialogService, useValue: dialogServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffManagementTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
