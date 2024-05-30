import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { QuoteOptionsComponent } from './quote-options.component';

describe('QuoteOptionsComponent', () => {
  let component: QuoteOptionsComponent;
  let fixture: ComponentFixture<QuoteOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuoteOptionsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [FormBuilder],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteOptionsComponent);
    component = fixture.componentInstance;
    component.quote = { paymentMethod: '', buildPrice: '', landPrice: '', initialCommitment: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
