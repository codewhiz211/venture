import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ConfirmationDialogComponent } from '@shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { SpecEditSectionComponent } from '../spec-edit-section/spec-edit-section.component';
import { SpecService } from '@services/spec/spec.service';
import { Subject } from 'rxjs';
import { WindowService } from '@services/window.service';
import { createFieldName } from '@shared/logic/createFieldName';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ven-spec-accordion-menu',
  templateUrl: './spec-accordion-menu.component.html',
  styleUrls: ['./spec-accordion-menu.component.scss'],
})
export class SpecAccordionMenuComponent implements OnInit, OnDestroy {
  @Input() activeSection;
  @Input() section;
  @Input() field;
  @Input() spec;
  @Input() colour = '#039be5'; // the colour to use for icons

  onlyEdit = false;
  isMobile = false;

  private destroy$ = new Subject();
  constructor(private dialogService: DialogService, private windowService: WindowService, private specService: SpecService) {
    this.isMobile = this.windowService.isMobile;
  }

  ngOnInit() {
    this.hideDuplicate();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * The user has the ability to edit either the section title or the section subtitle
   * Any changes are stored in the spec
   */
  onEditTitle(section) {
    const updateSection = { ...section };
    if (this.field) {
      updateSection.title = this.setSubtitleTitle(section, this.field);
    }

    this.dialogService
      .open(SpecEditSectionComponent, {
        data: {
          ...updateSection,
        },
        dialogTitle: `Edit heading - ${updateSection.title || updateSection.text}`,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((name) => {
        if (!name) {
          return;
        }
        const updatingSection = this.field
          ? section.fields.find((el) => {
              const subName = this.field['name'] && this.field['name'] === el['name'];
              const subText = this.field['text'] && this.field['text'] === el['text'];
              return subName || subText;
            })
          : '';
        if (updatingSection) {
          const subName = updatingSection['name'] || updatingSection['text'];
          this.specService.updateSubSectionName(this.spec.uid, section.name, subName, name).subscribe();
        } else {
          this.specService.updateSectionName(this.spec.uid, section.name, name).subscribe();
        }
      });
  }

  onEditPMNote(section, remove) {
    let name;
    let field;

    if (this.field) {
      name = createFieldName(this.field.text || this.field.name);
      field = this.field;
    } else {
      name = createFieldName(section.name);
      field = {};
    }

    const data = { [`${name}PmNote`]: '' };

    if (remove) {
      this.specService.deleteField(this.spec.uid, section.name, `${name}PmNote`).subscribe(() => {});
    } else {
      this.specService.updateSpec(this.spec.uid, section.name, field, data).subscribe(() => {});
    }
  }

  hideSection(sectionName: string) {
    this.spec.hiddenSections[sectionName] = true;
    this.specService.hideSection(this.spec.uid, sectionName).pipe(takeUntil(this.destroy$)).subscribe();
  }

  hideSubSection(sectionName: string, subSection: string) {
    this.specService.hideSubSection(this.spec.uid, sectionName, subSection).pipe(takeUntil(this.destroy$)).subscribe();
  }

  showSubSection(sectionName: string, subSection: string) {
    this.specService.showSubSection(this.spec.uid, sectionName, subSection).pipe(takeUntil(this.destroy$)).subscribe();
  }

  showSection(sectionName: string) {
    this.spec.hiddenSections[sectionName] = false;
    this.specService.showSection(this.spec.uid, sectionName).pipe(takeUntil(this.destroy$)).subscribe();
  }

  deleteSection(section) {
    const message = `This will permanently delete the ${section.title} section from the spec and cannot be undone.
    If you might want this section in the future, consider hiding the section instead`;
    this.dialogService
      .open(ConfirmationDialogComponent, {
        data: {
          html: message,
        },
        dialogTitle: 'Are you sure?',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.specService.deleteCustomSection(this.spec.uid, section.name).subscribe();
        }
      });
  }

  checkPMField(section) {
    if (!this.spec && !this.spec[section.name]) {
      return;
    }
    if (this.field && (this.field.text || this.field.name)) {
      return createFieldName(this.field.text || this.field.name) + 'PmNote' in this.spec[section.name];
    } else {
      return createFieldName(section.name) + 'PmNote' in this.spec[section.name];
    }
  }

  private hideDuplicate() {
    if (this.field && (this.field.name === 'blinds-additional' || this.field.name === 'cladding-additional')) {
      this.onlyEdit = true;
    }
  }

  private setSubtitleTitle(section, subsection) {
    if (this.spec['custom_fields'][section.name] && this.spec['custom_fields'][section.name][subsection.text]) {
      return this.spec['custom_fields'][section.name][subsection.text];
    } else if (this.spec['custom_fields'][section.name] && this.spec['custom_fields'][section.name][subsection.name]) {
      return this.spec['custom_fields'][section.name][subsection.name];
    } else {
      return subsection.text;
    }
  }
}
