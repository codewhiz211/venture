import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';

import { CardCalendarHeaderComponent } from './card-calendar-header.component';
import { JobsService } from '@jobs/services/jobs.service';
import { MatNativeDateModule } from '@angular/material/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { jobServiceStub } from '@shared/test/stubs';

describe('CardCalendarHeaderComponent', () => {
  let component: CardCalendarHeaderComponent<any>;
  let fixture: ComponentFixture<CardCalendarHeaderComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardCalendarHeaderComponent],
      imports: [MatDatepickerModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: JobsService, useValue: jobServiceStub }, MatCalendar],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
