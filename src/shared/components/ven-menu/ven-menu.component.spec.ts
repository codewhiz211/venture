import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MatMenuModule } from '@angular/material/menu';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VenMenuComponent } from './ven-menu.component';

describe('VenMenuComponent', () => {
  let component: VenMenuComponent;
  let fixture: ComponentFixture<VenMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VenMenuComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatMenuModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
