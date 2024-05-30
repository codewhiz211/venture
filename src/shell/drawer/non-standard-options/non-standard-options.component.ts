import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forEach, keys, mapObjIndexed } from 'ramda';

import { DrawerService } from '../drawer.service';
import { SpecService } from '@services/spec/spec.service';
import { sectionConfig } from '@shared/config/spec-config';

interface ICustomValue {
  dismissed: boolean;
  sectionKey: string;
  sectionName: string;
  fieldKey: string;
  fieldName: string;
  value: any;
}

@Component({
  selector: 'ven-non-standard-options',
  templateUrl: './non-standard-options.component.html',
  styleUrls: ['./non-standard-options.component.scss'],
})
export class NonStandardOptionsComponent implements OnInit {
  public sections;
  public customValues: ICustomValue[] = [];

  constructor(private drawerService: DrawerService, private specService: SpecService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.sections = [...sectionConfig];
    const currentSpec = this.specService.getActiveSpec();
    this.createCustomValueList(currentSpec ? currentSpec.custom_value : {});
  }

  onCancelClick() {
    this.drawerService.close();
  }

  dismissCustomValue(customValue) {
    this.specService.dismissCustomValue(customValue.sectionKey, customValue.fieldKey).subscribe(() => {
      const idxToDimiss = this.customValues.findIndex(
        (v) => v.sectionKey === customValue.sectionKey && v.fieldKey === customValue.fieldKey
      );
      const updated = this.customValues.filter((item, index) => index !== idxToDimiss);
      this.customValues = updated;
      this.cdRef.detectChanges();
    });
  }

  private createCustomValueList(customValues) {
    // only the keys and values are stored in the DB, look up appropriate section / field names for UI
    // TODO make this more functional. E.g. use the return value from mapObjIndexed
    mapObjIndexed((values, key) => {
      const sectionKey = key;
      const fieldKeys = keys(values);
      const sectionConfig = this.sections.find((s) => sectionKey.includes(s.name));
      forEach((fieldKey) => {
        const customValue = values[fieldKey];
        if (!customValue || customValue.dismissed) {
          return;
        }
        const fieldConfig = this.getFieldConfig(sectionKey, sectionConfig.fields, fieldKey);
        this.customValues.push({
          dismissed: false,
          sectionName: sectionConfig.title,
          sectionKey,
          fieldName: fieldConfig.display,
          fieldKey,
          value: customValue.value,
        });
      }, fieldKeys);
    }, customValues);
  }

  private getFieldConfig(sectionKey: String, fields, fieldKey: String) {
    //Consider some sectionKey with values '***-additional^x',such as 'flooring','blind' and 'cladding'
    if (sectionKey.includes('additional')) {
      const sectionName = sectionKey.split('^')[0];
      return fields.find((f) => f.name === sectionName).blockFields.find((f) => f.name === fieldKey);
    } else {
      return fields.find((f) => f.name === fieldKey);
    }
  }
}
