import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubbieJobCardComponent } from './subbie-job-card.component';
import { mockJob } from '@shared/test/mock-objects';

describe('SubbieJobCardComponent', () => {
  let component: SubbieJobCardComponent;
  let fixture: ComponentFixture<SubbieJobCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubbieJobCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubbieJobCardComponent);
    component = fixture.componentInstance;
    component.specUid = '';
    component.subbieUid = '';
    component.jobs = [{ job: mockJob, key: '' }];
    component.jobTitle = '';
    component.isRemedial = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
