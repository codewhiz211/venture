import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ExtraAmountComponent } from './extra-amount.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExtraAmountComponent', () => {
  let component: ExtraAmountComponent;
  let fixture: ComponentFixture<ExtraAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExtraAmountComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraAmountComponent);
    component = fixture.componentInstance;
    component.amount = 100;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display AMOUNT if amount is greater than zero', () => {
    const extraAmountElement: HTMLElement = fixture.nativeElement;
    const div = extraAmountElement.querySelector('div');
    expect(div.textContent).toEqual('$100');
  });

  it('should display message if amount is zero', () => {
    component.amount = 0;
    fixture.detectChanges();
    const extraAmountElement: HTMLElement = fixture.nativeElement;
    const div = extraAmountElement.querySelector('div');

    console.info('div', div);
    expect(div.textContent).toEqual('Included in build price');
  });
});
