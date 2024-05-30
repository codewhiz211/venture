import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProjectManagerFieldsComponent } from './project-manager-fields.component';

describe('ProjectManagerFieldsComponent', () => {
  let component: ProjectManagerFieldsComponent;
  let fixture: ComponentFixture<ProjectManagerFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectManagerFieldsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagerFieldsComponent);
    component = fixture.componentInstance;
    component.projectManager = { name: '', email: '', phone: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
