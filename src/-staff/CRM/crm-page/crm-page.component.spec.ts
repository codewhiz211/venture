import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CRMPageComponent } from './crm-page.component';

describe('CRMPageComponent', () => {
  let component: CRMPageComponent;
  let fixture: ComponentFixture<CRMPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CRMPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CRMPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
