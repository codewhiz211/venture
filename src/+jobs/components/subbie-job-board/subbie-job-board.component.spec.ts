import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubbieJobBoardComponent } from './subbie-job-board.component';
import { SubbieJobService } from '@services/spec/subbie-job.service';
import { subbieServiceStub } from '@shared/test/stubs';

describe('SubbieJobBoardComponent', () => {
  let component: SubbieJobBoardComponent;
  let fixture: ComponentFixture<SubbieJobBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubbieJobBoardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: SubbieJobService, useValue: subbieServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubbieJobBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
