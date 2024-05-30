import { Injectable } from '@angular/core';
import { LogicService } from '@services/spec/logic.service';
import { hintsConfig } from '@shared/config/spec-config';

@Injectable()
export class PrintService {
  constructor(private logicService: LogicService) {}

  private spec;

  getPrintFields(spec, section) {
    this.spec = spec;
    return section.fields.map((field) => {
      switch (field.type) {
        case 'subtitle':
          return {
            ...field,
            value: field.text,
            show: true,
          };

        case 'subtitle-conditional':
          return {
            ...field,
            value: field.text,
            show: this.displayConditional(section, field),
          };

        case 'text-optional':
          return {
            ...field,
            value: this.getFieldValue(section, field),
            hint: this.getFieldHint(section, field),
            show: this.getFieldValue(section, field) !== 'n/a',
          };

        case 'number':
        case 'textarea':
        case 'text':
          return {
            ...field,
            value: this.getFieldValue(section, field),
            hint: this.getFieldHint(section, field, spec),
            show: true,
            highlighted: this.highlightField(section, field),
            warning: field?.warning || false,
          };
        case 'multi-text':
          return {
            ...field,
            value: this.getFieldValue(section, field),
            hint: this.getFieldHint(section, field, spec),
            show: true,
            highlighted: this.highlightField(section, field),
            warning: field?.warning || false,
          };
        case 'dropdown-conditional':
        case 'dropdown':
        case 'number-conditional':
        case 'textarea-conditional':
        case 'text-conditional':
          return {
            ...field,
            value: this.getFieldValue(section, field),
            hint: this.getFieldHint(section, field),
            show: this.displayConditional(section, field),
          };

        case 'image-picker':
          return {
            ...field,
            value: this.getImage(section, field),
            hint: this.getFieldHint(section, field),
            show: this.displayConditional(section, field),
          };

        case 'colour':
          return {
            ...field,
            colour: this.getColour(section, field),
            hint: this.getFieldHint(section, field, spec),
            show: this.displayConditional(section, field),
            warning: field?.warning || false,
          };

        case 'note':
        case 'custom-blocks':
        case 'cladding':
          return {
            ...field,
            show: false,
          };
        case 'attach-image':
          return {
            ...field,
            hint: this.getFieldHint(section, field),
            show: this.displayConditional(section, field),
          };
      }
    });
  }

  private highlightField(section, field) {
    if (
      this.spec &&
      this.spec['highlighted_notes'] &&
      this.spec['highlighted_notes'][section.name] &&
      this.spec['highlighted_notes'][section.name][field.name]
    ) {
      return this.spec['highlighted_notes'][section.name][field.name];
    } else {
      return false;
    }
  }

  private getFieldValue(section, field) {
    if (!this.spec[section.name]) {
      return 'n/a';
    }
    return this.spec[section.name][field.name] ? this.spec[section.name][field.name] : 'n/a';
  }

  private getFieldHint(section, field, spec?) {
    const value = this.getFieldValue(section, field);

    const hints = hintsConfig.filter((h) => h.field === field.name && (h.value === 'ALWAYS' || h.value === value));

    if (spec && spec[section?.name] && spec[section?.name][`${field?.name}_hint`] && field?.warning) {
      return ` (${spec[section?.name][`${field?.name}_hint`]})`;
    }

    if (hints.length > 0) {
      return ` (${hints[0].text})`;
    }
    return undefined;
  }

  private getImage(section, field) {
    if (!this.spec[section.name][field.name]) {
      return undefined;
    }
    // check to see if stored value is in the list of options
    const value = this.spec[section.name][field.name];
    const selected = field.items.filter((i) => i.id === value)[0];
    if (selected) {
      // if it is, return the selected item
      return selected;
    } else {
      // else return the 'other' value as is
      return { display: value };
    }
  }

  private getColour(section, field) {
    if (!this.spec[section.name][field.name]) {
      return undefined;
    }
    if (!this.spec[section.name][field.name]) {
      return undefined;
    }
    const items = field.items.filter((i) => i.id === this.spec[section.name][field.name]);
    return items && items.length > 0 ? items[0] : this.spec[section.name][field.name] ? this.spec[section.name][field.name] : 'n/a';
  }

  private displayConditional(section, field) {
    return this.logicService.displayConditionalField(this.spec, section, field);
  }

  //   private getHint(section, field) {
  //     if (!this.spec[section.name][field.name]) {
  //       return undefined;
  //     }
  //     return this.spec[section.name][`${field.name}_hint`];
  //   }
}
