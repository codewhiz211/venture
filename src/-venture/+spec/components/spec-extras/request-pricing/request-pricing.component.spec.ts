import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import {
  dialogServiceStub,
  folderServiceStub,
  formBuilderStub,
  matSnackBarStub,
  pricingServiceStub,
  specFormatterServiceStub,
} from '@shared/test/stubs';

import { DialogService } from '@shell/dialogs/dialog.service';
import { FolderService } from 'src/+files/src/services/folder.service';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PricingService } from '@services/spec/pricing.service';
import { RequestPricingComponent } from './request-pricing.component';
import { SpecFormatterService } from '@services/spec/spec.formatter.service';
import exteriorConfig from '@shared/config/spec-config/exterior';

describe('RequestPricingComponent', () => {
  let component: RequestPricingComponent;
  let fixture: ComponentFixture<RequestPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequestPricingComponent],
      providers: [
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: FormBuilder, useValue: formBuilderStub },
        { provide: SpecFormatterService, useValue: specFormatterServiceStub },
        { provide: FolderService, useValue: folderServiceStub },
        { provide: PricingService, useValue: pricingServiceStub },
        { provide: MatSnackBar, useValue: matSnackBarStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPricingComponent);
    component = fixture.componentInstance;
    component.data = { spec: {}, section: exteriorConfig };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
