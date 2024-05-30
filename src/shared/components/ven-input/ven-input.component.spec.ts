import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VenInputComponent } from './ven-input.component';
import { formBuilderStub } from '@shared/test/stubs';

describe('VenInputComponent', () => {
  let component: VenInputComponent;
  let fixture: ComponentFixture<VenInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VenInputComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: FormBuilder, useValue: formBuilderStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
