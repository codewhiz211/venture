import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewSection, SectionType } from '@interfaces/spec.inteface';

import { BaseComponent } from '@shared/components/base.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '@shell/drawer/drawer.service';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecService } from '@services/spec/spec.service';
import { Subject } from 'rxjs';
import { sort } from 'ramda';

@Component({
  selector: 'ven-spec-add-new-section',
  templateUrl: './spec-add-new-section.component.html',
  styleUrls: ['./spec-add-new-section.component.scss'],
})
export class SpecAddNewSectionComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() data: any;

  public form: FormGroup;
  public subSections = [];
  public selectAll: boolean = true;
  public attachedCount = 0;
  public FreeSection = SectionType.Free;
  public DuplicateSection = SectionType.Duplicate;
  public sectionsAvailableForDuplication = [];

  private sortedList: string[] = [];
  private destroy$ = new Subject();

  public submitAction = {
    label: 'SAVE',
    handler: () => this.onSubmit(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onNoClick(),
  };

  constructor(
    private fb: FormBuilder,
    private drawerService: DrawerService,
    private dialogService: DialogService,
    private specService: SpecService,
    private activeSpecService: SpecActiveService
  ) {
    super();
  }

  ngOnInit() {
    this.buildForm();
    if (this.data.spec.sort && this.data.spec.sort.orderList) {
      this.sortedList = [...this.data.spec.sort.orderList];
    } else {
      this.data.sections.forEach((section) => {
        this.sortedList.push(section.name);
      });
    }
    this.sectionsAvailableForDuplication = this.getSectionsAvailableForDuplication(this.data.sections);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSectionChanged(field, value) {
    if (field === 'afterSection') {
      this.form.patchValue({ after: value.id });
    } else if (field == 'duplicateSection') {
      this.form.patchValue({ duplicateSection: value.id });
      const sectionToDuplicate = this.data.sections.find((s) => s.id === value.id);
      this.getSubSections(sectionToDuplicate);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      type: [SectionType.Free, [Validators.required]],
      after: ['', [Validators.required]],
      duplicateSection: [''],
    });
    this.form
      .get('type')
      .valueChanges.pipe(this.takeUntilDestroy())
      .subscribe((type) => {
        if (type == SectionType.Duplicate) {
          this.form.controls['duplicateSection'].setValidators([Validators.required]);
          this.form.patchValue({ duplicateSection: '' });
        } else {
          this.form.controls['duplicateSection'].clearValidators();
        }
      });
  }

  onNoClick(): void {
    this.drawerService.close();
    this.dialogService.closeActiveDialog();
  }

  getSubSections(section) {
    this.subSections = [];
    if (section && section.fields) {
      section.fields.forEach((field) => {
        if (field && field.type && field.type === 'subtitle' && field.text) {
          this.subSections.push({ name: field.text, checked: true });
        }
      });

      this.attachedCount = this.subSections.length;
    }
  }

  onSelectedChecklistsChanged() {
    this.attachedCount = this.subSections.filter((f) => f.checked === true).length;
    this.selectAll = this.attachedCount === this.subSections.length;
  }

  onSelectAll() {
    if (this.selectAll) {
      this.subSections.forEach((f) => (f.checked = true));
      this.attachedCount = this.subSections.length;
    } else {
      this.subSections.forEach((f) => (f.checked = false));
      this.attachedCount = 0;
    }
  }

  onSubmit() {
    const formValues = this.form.value;
    const sectionName = formValues.duplicateSection
      ? this.data.sections.find((s) => s.id === formValues.duplicateSection).name
      : formValues.name.split(' ').join('').toLowerCase();
    const maxIndex = this.getMaxSectionId();
    const sectionId = `${sectionName}_${maxIndex + 1}`;
    const fields =
      this.form.get('type').value === SectionType.Duplicate
        ? this.filterFields(sectionId)
        : [
            { name: `${sectionId}PmNote`, display: 'PM Notes', type: 'textarea' },
            {
              name: 'attachImage_additional',
              display: '',
              type: 'textarea',
              minRows: 13,
              maxRows: 15,
            },
          ];

    const newSection = new NewSection(
      maxIndex + 1,
      sectionId,
      formValues.name,
      true, //can hide
      true, //has extras
      fields,
      formValues.type
    );
    const index = this.data.sections.findIndex((el) => el.id === formValues.after);
    this.sortedList.splice(index + 1, 0, sectionId);

    this.specService.addNewSection(this.data.spec.uid, newSection.name, newSection, this.sortedList).subscribe(() => {
      this.onNoClick();

      // wait for the drawer close
      setTimeout(() => this.activeSpecService.openSectionAction(newSection.id), 800);
    });
  }

  private getSectionsAvailableForDuplication(sections) {
    return sort(
      (a, b) => {
        if (a.title > b.title) {
          return 1;
        }
        if (b.title > a.title) {
          return -1;
        }
        return 0;
      },
      sections.filter((s) => s.type === SectionType.Default && s.canDuplicate)
    );
  }

  private filterFields(pmNoteName) {
    const fieldsForSectionBeingDuplicated = this.data.sections.find((section) => section.id === this.form.value.duplicateSection).fields;
    fieldsForSectionBeingDuplicated[0].name = `${pmNoteName}PmNote`;
    if (this.subSections && this.subSections.length && !this.selectAll) {
      let fieldExist = true;
      return fieldsForSectionBeingDuplicated.reduce((acc, field) => {
        if (field && field.type && field.type === 'subtitle') {
          fieldExist = this.subSections.some((item) => item.name === field.text && item.checked);
        }

        if (fieldExist) {
          if (!acc.length) {
            return [{ ...field }];
          }
          return [...acc, { ...field }];
        } else {
          return [...acc];
        }
      }, []);
    } else {
      return fieldsForSectionBeingDuplicated;
    }
  }

  private getMaxSectionId() {
    return this.data.sections.reduce((max, section) => (section.id > max ? section.id : max), this.data.sections[0].id);
  }
}
