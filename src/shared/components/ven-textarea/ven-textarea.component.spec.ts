import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { VenTextareaComponent } from './ven-textarea.component';
import { formBuilderStub } from '@shared/test/stubs';

describe('VenTextareaComponent', () => {
  let component: VenTextareaComponent;
  let fixture: ComponentFixture<VenTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VenTextareaComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: FormBuilder, useValue: formBuilderStub }],
      imports: [TextFieldModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
