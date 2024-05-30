import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { adminServiceStub, clientServiceStub, dialogServiceStub, matSnackBarStub } from '@shared/test/stubs';

import { AdminService } from '../admin.service';
import { BuildManagementTabComponent } from './build-management-tab.component';
import { ClientService } from '@clients/services/client.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BuildManagementTabComponent', () => {
  let component: BuildManagementTabComponent;
  let fixture: ComponentFixture<BuildManagementTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuildManagementTabComponent],
      providers: [
        { provide: ClientService, useValue: clientServiceStub },
        { provide: AdminService, useValue: adminServiceStub },
        { provide: MatSnackBar, useValue: matSnackBarStub },
        { provide: DialogService, useValue: dialogServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildManagementTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
