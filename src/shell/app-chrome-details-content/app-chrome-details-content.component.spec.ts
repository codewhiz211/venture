import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { AppChromeDetailContentComponent } from './app-chrome-details-content.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppChromeDetailSubHeaderComponent', () => {
  let component: AppChromeDetailContentComponent;
  let fixture: ComponentFixture<AppChromeDetailContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppChromeDetailContentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTabsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppChromeDetailContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
