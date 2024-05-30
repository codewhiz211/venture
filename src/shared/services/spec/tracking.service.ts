import { BehaviorSubject } from 'rxjs';
import { ClientSpec } from '../../interfaces/client-spec.interface';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrackChangesModalComponent } from '@shared/components/track-changes-modal/track-changes-modal.component';
import { TrackInterface } from '../../interfaces/track.interface';
import { WindowService } from '../window.service';
import { getValue } from '../../logic/getFieldValue';
import { path } from 'ramda';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private trackChanges$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  get getCurrentChanges() {
    return this.trackChanges$.getValue();
  }

  private _trackChangesEnabled: boolean = false;
  get trackChangesEnabled() {
    return this._trackChangesEnabled;
  }

  private _trackingStarted;
  get getTrackingStartedTime() {
    return this._trackingStarted;
  }

  constructor(public snackBar: MatSnackBar, private dialog: MatDialog, private windowService: WindowService) {}

  // TODO can changes ever be more than one object??
  addedChangesToTracking(id: string, sectionName: string, fieldName: string, fieldType: string, changes: any) {
    const newChanges: TrackInterface[] = [];
    const currentChanges = this.getCurrentChanges;

    for (const key in changes) {
      if (changes.hasOwnProperty(key) && changes[key] && key.indexOf('_hint') < 0 && key.indexOf('_error') < 0) {
        const value = getValue(changes[key], fieldType);
        newChanges.push(...this.addChangeToCurrentChanges(id, sectionName, fieldName, value, currentChanges));
      }
    }
    if (newChanges.length === 0) {
      // not a real change, make sure we keep existing values in tracking list
      this.trackChanges$.next(currentChanges);
    } else {
      this.trackChanges$.next(newChanges);
    }
  }

  disableTracking() {
    this.trackChanges$.next([]);
    this._trackChangesEnabled = false;
  }

  enableTracking() {
    this.trackChanges$.next([]);
    this._trackingStarted = Date.now();
    this._trackChangesEnabled = true;
  }

  openTrackChangesSnackBar(spec: ClientSpec) {
    this.snackBar
      .open('Tracked Mode enabled. Click the button again at any point to view a summary of changes.', 'Cancel', { duration: 5000 })
      .onAction()
      .subscribe(() => {
        this.disableTracking();
      });
  }

  showAlertDialog() {
    return this.dialog.open(TrackChangesModalComponent, {
      panelClass: 'full-width-dialog',
      disableClose: true,
      width: this.windowService.isMobile ? '100%' : '50%',
    });
  }

  private addChangeToCurrentChanges(id, section, fieldName, value, currentChanges) {
    if (currentChanges.length === 0) {
      return [{ id, section, field: fieldName, value }];
    }

    const existingIndex = currentChanges.findIndex((c) => c.id === id);

    if (existingIndex < 0) {
      return currentChanges.concat({ id, section, field: fieldName, value });
    }

    // update existing item
    return currentChanges.map((item, index) => {
      if (index !== existingIndex) {
        return item;
      }
      return {
        ...item,
        value,
      };
    });
  }

  public trackChangesIfTrackingActive(spec, section, field, changesToSave) {
    if (this.trackChangesEnabled) {
      let sectionName;
      const keys = Object.keys(changesToSave);
      for (const key of keys) {
        if ((changesToSave[key] == null && key === 'custom_value') || key.indexOf('_hint') > -1 || key.indexOf('_error') > -1) {
          continue;
        }
        let fieldName;
        let f = field;
        if (field == null) {
          f = this.getField(section, key);
        }
        fieldName = f.display;
        const subSection = this.checkSubSection(spec, section, f);
        const formedSectionName = this.formatSectionName(section.name, fieldName);

        const sectionTitle = path([section.name, 'title'], spec);
        if (sectionTitle) {
          sectionName = sectionTitle;
        } else {
          sectionName = section.title || formedSectionName.formattedName;
        }
        sectionName = subSection ? sectionName + ` / ${subSection}` : sectionName;

        // check for fields with additional blocks
        if (formedSectionName !== formedSectionName.fieldNameIndex) {
          fieldName = formedSectionName.fieldNameIndex;
        }

        const id = `${sectionName}-${fieldName}-${f.name}`.replace(/ /g, '');
        this.addedChangesToTracking(id, sectionName, fieldName, f.type, {
          [key]: changesToSave[key],
        });
      }
    }
  }

  private getField(section, fieldName) {
    for (const field of section.fields) {
      if (field.name === fieldName) {
        return field;
      }
    }
  }

  private checkSubSection(spec, section, field) {
    if (!section || !section.fields || !field) {
      return;
    }

    let fieldIndex;

    if (section && section.fields) {
      fieldIndex = section.fields.indexOf(field);
    }

    const fields = section.fields;

    let subSectionName;
    let subSectionDisplayName;

    for (let i = 0, l = fields.length; i < l; i++) {
      if (fields[i] && fields[i].type && (fields[i].type === 'subtitle' || fields[i].type === 'subtitle-conditional')) {
        subSectionName = fields[i].name;
        subSectionDisplayName = fields[i].text;
      }
      if (fieldIndex <= i) {
        break;
      }
    }
    if (spec && spec['custom_fields'] && spec['custom_fields'][section.name] && spec['custom_fields'][section.name][subSectionName]) {
      return spec['custom_fields'][section.name][subSectionName];
    } else {
      return subSectionDisplayName;
    }
  }

  /**
   * The Summary displays the changed option as `SectionName - FieldName`
   * This method returns this label.
   * Note: Section names for some sections contain a position identifier (e.g. custom blocks)
   * This function converts any such section names to a user friendly name
   * E.g. It turns 'cladding-additional^0','cladding-additional^1' etc into 'Cladding'
   */
  private formatSectionName(name: string, fieldNameIndex) {
    const index = name.split('^')[1];

    let formattedName = '';

    name
      .split('^')[0]
      .split('-')
      .forEach((item) => {
        formattedName = formattedName + item.charAt(0).toUpperCase() + item.substr(1).toLowerCase() + ' ';
      });

    if (index) {
      fieldNameIndex = `${fieldNameIndex} - ${+index + 1}`;
    }

    if (formattedName.indexOf('Cladding') === 0 || formattedName.indexOf('Blinds') === 0) {
      formattedName = formattedName.split('Additional')[0];
    }

    return { formattedName, fieldNameIndex };
  }
}
