import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchableTableComponent } from './searchable-table.component';
import { WindowService } from '@services/window.service';
import { windowServiceStub } from '@shared/test/stubs';

describe('SearchableTableComponent', () => {
  let component: SearchableTableComponent;
  let fixture: ComponentFixture<SearchableTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchableTableComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: WindowService, useValue: windowServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchableTableComponent);
    component = fixture.componentInstance;
    component.columns = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
