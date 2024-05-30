import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubbiesBlankMessageComponent } from './subbies-blank-message.component';

describe('SubbiesBlankMessageComponent', () => {
  let component: SubbiesBlankMessageComponent;
  let fixture: ComponentFixture<SubbiesBlankMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubbiesBlankMessageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubbiesBlankMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
