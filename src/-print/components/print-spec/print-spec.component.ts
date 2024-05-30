import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { errorsConfig, sectionConfig } from '@shared/config/spec-config';

import { ClientModel } from '@interfaces/client-model';
import { ClientSpec } from '@interfaces/client-spec.interface';
import { ExtrasService } from '@services/spec/extras.service';
import { LogicService } from '@services/spec/logic.service';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecService } from '@services/spec/spec.service';
import { Subject } from 'rxjs';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-print-spec',
  templateUrl: './print-spec.component.html',
  styleUrls: ['./print-spec.component.scss'],
})
export class PrintSpecComponent implements OnInit, OnDestroy {
  @Input() specUid: string;

  public spec: ClientSpec;

  public customValuesPathList: string[] = [];

  public sections;

  public extras;
  public consultant;

  public printSpec: boolean = false;
  public printExtras: boolean = false;
  public printQuote: boolean = false;
  public printChecklists: boolean = false;
  public printChecklistIds: number[];
  public progress: string;
  public isNotChrome = false;
  public currentClient: ClientModel;
  public safetySignature: string;
  public isSigned;

  private _destroy$ = new Subject<any>();
  public todaysDate = Date.now();

  constructor(
    private cdr: ChangeDetectorRef,
    private windowService: WindowService,
    public specService: SpecService,
    private extrasService: ExtrasService,
    private logicService: LogicService,
    private specActiveService: SpecActiveService
  ) {}

  ngOnInit() {
    // ensure we can scroll the whole page

    this.windowService.addBodyClass('print-page');
    this.windowService.addBodyClass('do-scroll');

    this.sections = sectionConfig;
    this.isNotChrome = !this.windowService.isChrome();

    this.specActiveService.activeSpec$.subscribe((spec) => {
      this.spec = spec;
      if (this.spec) {
        this.extras = this.getExtras(spec);
      }
    });

    console.log(`loading spec ${this.specUid}`);
    this.specService.getClientSpec(this.specUid);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private getExtras(spec) {
    let extras;
    // if share SPEC ONLY - show optional extras in spec
    extras = this.extrasService.getAllExtraSections(spec);
    if (extras['electrical']) {
      const validOptionalExtras = extras['electrical'].extras.filter((e) => e.optional).map((e) => ({ ...e, amount: 0 }));
      if (validOptionalExtras.length > 0) {
        extras['electrical_optional'] = validOptionalExtras;
      }
    }

    return extras;
  }

  public findFieldError(sectionName, block, fieldName) {
    // currently only custom cladding section has errors
    // if errors are added elsewhere this will need to be revisited.
    const potentialErrors = errorsConfig.filter((e) => e.field === fieldName || e.sourceField === fieldName);
    let errorMsg = null;
    for (let e = 0; e < potentialErrors.length; e++) {
      const error = potentialErrors[e];
      if (error.field === fieldName || error.sourceField === fieldName) {
        const currentSpec = this.specService.getActiveSpec();
        if (currentSpec) {
          const fieldValue = currentSpec[sectionName][block][error.field];
          const sourceValue = currentSpec[sectionName][block][error.sourceField];
          const errorFound = error.method(fieldValue, sourceValue) ? error.msg : null;
          if (errorFound) {
            errorMsg = errorFound;
          }
        }
      }
    }
    return errorMsg;
  }

  getSectionClass(section) {
    // some sections require slightly different styling
    switch (section.name) {
      case 'garage':
      case 'exterior':
        return 'section-dashed';
      default:
        return '';
    }
  }

  getSectionFields(section) {
    return section.fields.filter((f) => f.type !== 'subtitle' && f.type !== 'note');
  }

  getFieldValue(section, field) {
    if (!this.spec[section.name]) {
      return 'n/a';
    }
    return this.spec[section.name][field.name] ? this.spec[section.name][field.name] : 'n/a';
  }

  getImage(section, field) {
    if (!this.spec[section.name][field.name]) {
      return undefined;
    }
    const selected = field.items.filter((i) => i.id === this.spec[section.name][field.name])[0];
    if (selected) {
      return selected;
    }
    return undefined;
  }

  getColour(section, field) {
    if (!this.spec[section.name]) {
      return undefined;
    }
    if (!this.spec[section.name][field.name]) {
      return undefined;
    }
    const items = field.items.filter((i) => i.id === this.spec[section.name][field.name]);
    return items && items.length > 0 ? items[0] : undefined;
  }

  displayConditional(section, field) {
    return this.logicService.displayConditionalField(this.spec, section, field);
  }
}
