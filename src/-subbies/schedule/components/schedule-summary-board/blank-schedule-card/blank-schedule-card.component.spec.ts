import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { BlankScheduleCardComponent } from './blank-schedule-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BlankScheduleCardComponent', () => {
  let component: BlankScheduleCardComponent;
  let fixture: ComponentFixture<BlankScheduleCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlankScheduleCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlankScheduleCardComponent);
    component = fixture.componentInstance;
    component.activeDate = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
