import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { AuditService } from '@services/spec/audit.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '../drawer.service';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ven-spec-audit',
  templateUrl: './spec-audit.component.html',
  styleUrls: ['./spec-audit.component.scss'],
})
export class SpecAuditComponent implements OnInit, OnDestroy {
  @Input() data: any;

  public sectionControl: FormControl;
  public optionControl: FormControl;
  public fieldsList: Array<{ name: string; display: string }> = [];
  public auditList;
  public fieldName: string;
  public fieldDisplayName: string;
  public changesList = [];
  public blocks = [];
  public groupFields = [];

  private selectedGroup: string;
  private sectionName: string;
  private destroy$ = new Subject();

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };

  constructor(private auditService: AuditService, private drawerService: DrawerService, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.sectionControl = new FormControl('');
    this.optionControl = new FormControl('');
    this.getAudit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSectionChanged(section) {
    const newList = [];
    this.changesList = [];
    this.groupFields = [];
    this.sectionName = '';
    this.fieldName = '';

    const fieldIgnoreList = ['subtitle', 'subtitle-conditional', 'note', 'hint'];
    this.fieldsList = [];
    this.blocks = [];
    section.fields.forEach((field) => {
      if (!field.type || !fieldIgnoreList.includes(field.type)) {
        newList.push({
          name: field.name,
          display: this.getDisplayName(section.name, field),
          type: field.type,
        });
      }
    });
    this.optionControl.reset();
    this.sectionName = section.name;
    this.fieldsList = [...newList];
  }

  // TODO refactor duplicated code into shared methods
  onGroupChanged(group) {
    this.groupFields = [];
    this.changesList = [];
    if (this.auditList && this.auditList[this.fieldName]) {
      const sectionAudit = this.auditList[this.fieldName];
      const blockChanges = sectionAudit[`${this.fieldName}-${group.idx}`];

      this.selectedGroup = `${this.fieldName}-${group.idx}`; // TODO does not appear to be used
      for (const key in blockChanges) {
        if (blockChanges?.hasOwnProperty(key)) {
          this.groupFields.push({ display: this.camelCaseToNormal(key), name: key, changes: blockChanges[key] });
        }
      }
    }
  }

  onGroupFieldChanged(changes) {
    // @ts-ignore
    this.changesList = changes.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  onFieldChanged(field) {
    this.changesList = [];
    this.groupFields = [];
    this.fieldName = field.name;
    this.fieldDisplayName = this.getDisplayName(this.sectionName, field);
    this.blocks = [];

    if (field.name.includes('-additional')) {
      const blocks = this.auditList[field.name] || {};
      for (const key in blocks) {
        if (blocks?.hasOwnProperty(key)) {
          const keyLength = +key.split('-').length;
          const idx = +key.split('-')[keyLength - 1];

          this.blocks.push({ idx, name: `Group ${idx + 1}` });
        }
      }
      return;
    }

    if (this.auditList && this.auditList[this.sectionName] && this.auditList[this.sectionName][this.fieldName]) {
      const changes = this.auditList[this.sectionName][this.fieldName] || [];
      const sanitised = changes.map((change) => {
        if (['image-picker', 'colour'].includes(field.type)) {
          change.value = this.camelCaseToNormal(change.value);
        }
        return change;
      });
      this.changesList = sanitised.filter((item) => item != null).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      this.fieldName = field.display;
    }
  }

  onCancelClick() {
    this.drawerService.close();
    this.dialogService.closeActiveDialog();
  }

  clearSectionAndField() {
    this.sectionControl.reset();
    this.optionControl.reset();
    this.fieldsList = [];
    this.fieldName = null;
    this.changesList = [];
  }

  // We dont want to display the DB key to the user
  // Instead display a nicely formatted name, that is also unique
  // E.g. Dont show several "Info" fields for the same section
  private getDisplayName(sectionName, field) {
    const sectionsWithDuplicates = ['ensuite', 'joinery', 'landscape', 'mainBathroom', 'toilet'];

    if (!sectionsWithDuplicates.includes(sectionName)) {
      return field.display || field.name.charAt(0).toUpperCase() + field.name.slice(1);
    }

    switch (field.display) {
      case 'Code':
        if (sectionName === 'joinery') {
          // handle some specific Joinery fields
          return `Code ${field.condition.value}`;
        }
        return field.display || field.name.charAt(0).toUpperCase() + field.name.slice(1);

      case 'Additional Info':
        if (sectionName === 'landscape' || sectionName === 'joinery') {
          return getLandscapeDisplayNameFromAdditionalFieldName(field);
        }
        return getDisplayNameFromFieldName(field, 'A', 'Additional Info');

      case 'Allowance':
        return getDisplayNameFromFieldName(field, 'A', 'Allowance');

      case 'Area':
        return getDisplayNameFromFieldName(field, 'A', 'Area');

      case 'Friendly Neighbour Height':
        return getDisplayNameFromFieldName(field, 'F', 'Friendly Neighbour Height');

      case 'LM':
        return getDisplayNameFromFieldName(field, 'L', 'LM');

      case 'PM Notes':
        return getDisplayNameFromFieldName(field, 'P', 'PM Notes');

      case 'Tile Colour':
        return getDisplayNameFromFieldName(field, 'T', 'Tile Colour').replace(' Colour)', ')');

      case 'Tile Type':
        return getDisplayNameFromFieldName(field, 'T', 'Tile Type');

      case 'Tile Layout':
        return getDisplayNameFromFieldName(field, 'T', 'Tile Layout');

      case 'Grout Colour':
        return getDisplayNameFromFieldName(field, 'G', 'Grout Colour');

      default:
        return field.display || field.name.charAt(0).toUpperCase() + field.name.slice(1);
    }
  }

  private getAudit() {
    this.auditService
      .getSpecAudit(this.data.uid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.auditList = res;
      });
  }

  private camelCaseToNormal(word) {
    return word
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/([a-zA-Z])(\d)/g, '$1 $2') // E.g. change Colour1 to Colour 1
      .trim();
  }
}

function getLandscapeDisplayNameFromAdditionalFieldName(field) {
  // landscape section formats names differently!
  const withoutPrefxSuffix = field.name.replace('landscape_', '').replace('_additional', '');
  return `Additional Info (${splitCamelCase(splitUnderscore(withoutPrefxSuffix))})`;
}

function getDisplayNameFromFieldName(field, splitOn, prefix) {
  const split = field.name.split(splitOn)[0];
  return split.length === 1 ? field.display : `${prefix} (${splitCamelCase(split.charAt(0).toUpperCase() + split.slice(1))})`;
}

// TODO to utils

function splitUnderscore(word) {
  const split = word.split('_');
  const words = [];
  split.forEach((word) => {
    words.push(captialiseWord(word));
  });
  return words.join(' ');
}

function captialiseWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function splitCamelCase(word) {
  var output,
    i,
    l,
    capRe = /[A-Z]/;
  if (typeof word !== 'string') {
    throw new Error('The "word" parameter must be a string.');
  }
  output = [];
  for (i = 0, l = word.length; i < l; i += 1) {
    if (i === 0) {
      output.push(word[i].toUpperCase());
    } else {
      if (i > 0 && capRe.test(word[i])) {
        output.push(' ');
      }
      output.push(word[i]);
    }
  }
  return output.join('');
}
