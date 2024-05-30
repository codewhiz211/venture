import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { adminServiceStub, dialogServiceStub } from '@shared/test/stubs';

import { AdminService } from '../admin.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubbiesManagementTabComponent } from './subbies-management-tab.component';

describe('SuffiesManagementTabComponent', () => {
  let component: SubbiesManagementTabComponent;
  let fixture: ComponentFixture<SubbiesManagementTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubbiesManagementTabComponent],
      providers: [
        { provide: AdminService, useValue: adminServiceStub },
        { provide: DialogService, useValue: dialogServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubbiesManagementTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
