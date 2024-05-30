import { Injectable } from '@angular/core';
import { LoggerService } from '@services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class PrintCustomService {
  constructor(private loggerService: LoggerService) {}

  /**
   * @description Get custom blocks to print for the supplied sectionConfig
   * @param {object} spec - the current saved spec
   * @param {object} fieldConfig - config for this field
   */
  public getCustomBlocks(spec, fieldConfig) {
    // get current blocks saved in spec
    const blocks = spec[fieldConfig.name] || [];
    const blocksWithFields = [];
    blocks.forEach((block, index) => {
      if (!block) {
        return null;
      }
      const fields = [];
      // each block will have one or more fields on it, each with a value
      Object.keys(block).forEach((blockField) => {
        // don't display dummy fields, error fields or hint fields
        if (blockField.indexOf('dummy') === -1 && blockField.indexOf('error') === -1 && blockField.indexOf('hint') === -1) {
          // we want to display the fields in the correct order, get the order from the fields config
          const blockFieldSpec = this.getFieldSpec(fieldConfig, blockField);
          // fieldSpec might be undefined IF, the spec for an additional area has been udpated.
          // E.g. flooring-additional used to have a field called groutColour. But this was moved
          // to tiles-additional. And thus there will no longer be a spec for it in flooring-additional
          if (blockFieldSpec) {
            const displayName = blockFieldSpec.display;
            const order = blockFieldSpec.order;
            const showField = this.showCustomField(spec, fieldConfig, blockFieldSpec, index);
            fields.push({
              block: index,
              name: blockField,
              display: displayName,
              value: block[blockField] !== ' ' ? block[blockField] : 'n/a',
              order: order,
              show: showField,
            });
          }
        }
      });
      const filtered = fields.filter((f) => f.show);
      const ordered = filtered.sort((a, b): any => this.sortByOrder(b, a));

      block.fields = ordered;
      blocksWithFields.push(block);
    });

    // it would appear we sometimes end up with null blocks in firebase
    return blocksWithFields.filter((b) => b !== null);
  }

  /**
   * @description Determine if the custom section needs to be printed for the supplied section config
   *              It does'nt if it there are no blocks.
   *              Or if it only has one block and there are no fields on that block.
   * @param {object} spec - the current saved spec
   * @param {object} fieldConfig - config for this field
   */
  public printCustomSection(spec, fieldConfig) {
    if (!spec) {
      return false;
    }
    const blocks = spec[fieldConfig.name] || [];
    if (blocks.length === 0) {
      return false;
    }
    if (blocks.length === 1) {
      return blocks[0].fields.length > 0;
    }
    return true;
  }

  private showCustomField(spec, fieldConfig, blockFieldSpec, blockIndex) {
    // custom fields can also be conditional - check to see if it should be shown
    if (!blockFieldSpec.condition) {
      return true;
    }
    const triggerFieldValue = spec[fieldConfig.name][blockIndex][blockFieldSpec.condition.field];
    const show = blockFieldSpec.condition.value.startsWith('!')
      ? triggerFieldValue !== blockFieldSpec.condition.value.substring(1)
      : !!blockFieldSpec.condition.value.split(',').find((e) => e == triggerFieldValue);
    return show;
  }

  private getFieldSpec(fieldConfig, fieldName) {
    // each field has a fieldConfig associated with it in the section config
    // E.g. in blinds.ts => custom.blockFields []
    const blockFields = fieldConfig.blockFields;
    const spec = blockFields.filter((f) => f.name === fieldName)[0];
    if (!spec) {
      this.loggerService.warn(`${fieldName} is no longer a valid property for ${fieldConfig.name}. (data in DB is out of sync)`);
      return undefined;
    }
    return spec;
  }

  private sortByOrder(a, b) {
    return a.order > b.order ? -1 : a.order < b.order ? 1 : 0;
  }
}
