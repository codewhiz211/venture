import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VenTableComponent } from './ven-table.component';
import { WindowService } from '@services/window.service';
import { windowServiceStub } from '@shared/test/stubs';

describe('VenTableComponent', () => {
  let component: VenTableComponent;
  let fixture: ComponentFixture<VenTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VenTableComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: WindowService, useValue: windowServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenTableComponent);
    component = fixture.componentInstance;
    component.columns = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
