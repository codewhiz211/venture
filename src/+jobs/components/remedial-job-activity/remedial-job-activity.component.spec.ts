import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { dialogServiceStub, windowServiceStub } from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RemedialJobActivityComponent } from './remedial-job-activity.component';
import { WindowService } from '@services/window.service';

describe('RemedialJobActivityComponent', () => {
  let component: RemedialJobActivityComponent;
  let fixture: ComponentFixture<RemedialJobActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RemedialJobActivityComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: WindowService, useValue: windowServiceStub },
        { provide: DialogService, useValue: dialogServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemedialJobActivityComponent);
    component = fixture.componentInstance;
    component.specUid = '';
    component.jobUid = '';
    component.subbieUid = '';
    component.job = { activity: [{ step: 'created' }, { step: 'scheduled' }, { step: 'completed' }] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
