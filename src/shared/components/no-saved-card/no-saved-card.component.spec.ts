import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoSavedCardComponent } from './no-saved-card.component';

describe('NoSavedCardComponent', () => {
  let component: NoSavedCardComponent;
  let fixture: ComponentFixture<NoSavedCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoSavedCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoSavedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
