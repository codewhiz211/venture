import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { clientServiceStub, preferenceServiceStub, routerStub } from '@shared/test/stubs';

import { BuildsPageComponent } from './builds-page.component';
import { ClientService } from '@clients/services/client.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PreferenceService } from '@services/preference.service';
import { Router } from '@angular/router';

describe('BuildsPageComponent', () => {
  let component: BuildsPageComponent;
  let fixture: ComponentFixture<BuildsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuildsPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ClientService, useValue: clientServiceStub },
        { provide: Router, useValue: routerStub },
        { provide: PreferenceService, useValue: preferenceServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
