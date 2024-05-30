import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StandardJobActivityComponent } from './standard-job-activity.component';
import { WindowService } from '@services/window.service';
import { windowServiceStub } from '@shared/test/stubs';

describe('StandardJobActivityComponent', () => {
  let component: StandardJobActivityComponent;
  let fixture: ComponentFixture<StandardJobActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StandardJobActivityComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: WindowService, useValue: windowServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardJobActivityComponent);
    component = fixture.componentInstance;
    component.activity = [{}, {}, {}];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
