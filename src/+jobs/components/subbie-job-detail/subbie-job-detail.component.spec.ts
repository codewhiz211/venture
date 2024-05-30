import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxStubComponent, MatSelectStubComponent } from '@shared/test/ngSelectStub';
import { dialogServiceStub, drawerServiceStub, specActiveServiceStub, subbieServiceStub } from '@shared/test/stubs';

import { AuthService } from '@auth/services/auth.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '@shell/drawer/drawer.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MockAuthService } from '@shared/test/mock-services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ShareService } from '@services/spec/share.service';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SubbieJobDetailComponent } from './subbie-job-detail.component';
import { SubbieJobService } from '@services/spec/subbie-job.service';
import { mockJob } from '@shared/test/mock-objects';

describe('SubbieJobDetailComponent', () => {
  let component: SubbieJobDetailComponent;
  let fixture: ComponentFixture<SubbieJobDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubbieJobDetailComponent, MatSelectStubComponent, MatCheckboxStubComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DrawerService, useValue: drawerServiceStub },
        { provide: SubbieJobService, useValue: subbieServiceStub },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ShareService, useValue: {} },
        { provide: SpecActiveService, useValue: specActiveServiceStub },
        { provide: DialogService, useValue: dialogServiceStub },
        FormBuilder,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubbieJobDetailComponent);
    component = fixture.componentInstance;
    component.data = { uid: '', subbieUid: '', jobUid: '', job: mockJob };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
