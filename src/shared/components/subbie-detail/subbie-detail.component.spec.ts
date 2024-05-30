import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  adminServiceStub,
  dialogServiceStub,
  drawerServiceStub,
  httpClientStub,
  matSnackBarStub,
  windowServiceStub,
} from '@shared/test/stubs';

import { AdminService } from 'src/-staff/admin-page/admin.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '@shell/drawer/drawer.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubbieDetailComponent } from './subbie-detail.component';
import { WindowService } from '@services/window.service';
import { mockSubbie } from '@shared/test/mock-objects';

describe('SubbieDetailComponent', () => {
  let component: SubbieDetailComponent;
  let fixture: ComponentFixture<SubbieDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubbieDetailComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: HttpClient, useValue: httpClientStub },
        { provide: DrawerService, useValue: drawerServiceStub },
        { provide: AdminService, useValue: adminServiceStub },
        { provide: MatDialog, useValue: {} },
        { provide: WindowService, useValue: windowServiceStub },
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: MatSnackBar, useValue: matSnackBarStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubbieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
