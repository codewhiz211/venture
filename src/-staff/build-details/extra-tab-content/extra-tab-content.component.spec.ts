import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { specActiveServiceStub, specServiceStub } from '@shared/test/stubs';

import { ExtraTabContentComponent } from './extra-tab-content.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecService } from '@services/spec/spec.service';

describe('ExtraTabContentComponent', () => {
  let component: ExtraTabContentComponent;
  let fixture: ComponentFixture<ExtraTabContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExtraTabContentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SpecService, useValue: specServiceStub },
        { provide: SpecActiveService, useValue: specActiveServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraTabContentComponent);
    component = fixture.componentInstance;
    component.data = { spec: { quote: { includeGST: true }, details: { postContract: true } } };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
