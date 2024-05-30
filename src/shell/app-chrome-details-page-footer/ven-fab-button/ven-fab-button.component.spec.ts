import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { IconComponent } from '@shared/icons/icon-component/icon.component';
import { MatIconModule } from '@angular/material/icon';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VenFabButtonComponent } from './ven-fab-button.component';

describe('VenFabButtonComponent', () => {
  let component: VenFabButtonComponent;
  let fixture: ComponentFixture<VenFabButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VenFabButtonComponent, IconComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatIconModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenFabButtonComponent);
    component = fixture.componentInstance;
    component.actionItem = { shownOnDesktop: true, colour: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
