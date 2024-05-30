import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { BuildSummaryCardComponent } from './build-summary-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PreferenceService } from '@services/preference.service';
import { preferenceServiceStub } from '@shared/test/stubs';

describe('BuildSummaryCardComponent', () => {
  let component: BuildSummaryCardComponent;
  let fixture: ComponentFixture<BuildSummaryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuildSummaryCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: PreferenceService, useValue: preferenceServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildSummaryCardComponent);
    component = fixture.componentInstance;
    component.build = { status: '', lot: '', client: '', subdivision: '', uid: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
