import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { DialogService } from '@shell/dialogs/dialog.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StatusComponent } from './status.component';
import { dialogServiceStub } from '@shared/test/stubs';

describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: DialogService, useValue: dialogServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
