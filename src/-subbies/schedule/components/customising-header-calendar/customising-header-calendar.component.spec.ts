import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { jobServiceStub, windowServiceStub } from '@shared/test/stubs';

import { CustomisingHeaderCalendarComponent } from './customising-header-calendar.component';
import { JobsService } from '@jobs/services/jobs.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WindowService } from '@services/window.service';

describe('CustomisingHeaderCalendarComponent', () => {
  let component: CustomisingHeaderCalendarComponent;
  let fixture: ComponentFixture<CustomisingHeaderCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomisingHeaderCalendarComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: WindowService, useValue: windowServiceStub },
        { provide: JobsService, useValue: jobServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomisingHeaderCalendarComponent);
    component = fixture.componentInstance;
    component.scheduledDates = [new Date('September 17, 2021 00:00:00'), new Date('September 23, 2021 00:00:00')];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
