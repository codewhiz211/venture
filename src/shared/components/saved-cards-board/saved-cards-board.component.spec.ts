import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SavedCardsBoardComponent } from './saved-cards-board.component';

describe('SavedCardsBoardComponent', () => {
  let component: SavedCardsBoardComponent;
  let fixture: ComponentFixture<SavedCardsBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SavedCardsBoardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedCardsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
