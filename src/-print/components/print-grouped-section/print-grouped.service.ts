import { Injectable } from '@angular/core';
import { LogicService } from '@services/spec/logic.service';
import { values } from 'ramda';

@Injectable({
  providedIn: 'root',
})
export class PrintGroupedService {
  constructor(private logicService: LogicService) {}

  /**
   * @description Determine groups of controls
   *
   * @param {object} spec - the current saved spec
   * @param {object} sectionConfig - config for this section
   */
  public getGroups(spec, section) {
    const groups = {};
    if (section?.fields) {
      // if this section has subtitles, we want to create groups where each subtitle is title for group
      // if the subtitle is conditional, check to see if it should be displayed. If not, do not add any fields until we see another subtitle
      section.fields.forEach((field) => {
        if (field.type === 'subtitle') {
          if (groups[section.name]) {
            return;
          }
          if (field.name == undefined) {
            groups[section.name] = {
              title: field.text,
              fields: [],
              customSubtitle: field?.name,
            };
          } else {
            groups[field.name] = {
              title: field.text,
              fields: [],
              customSubtitle: field?.name,
            };
          }
        } else if (field.type === 'subtitle-conditional') {
          const displaySubtitle = this.displayConditional(spec, section, field);
          if (displaySubtitle) {
            groups[field.name] = {
              title: field.text,
              fields: [],
            };
          }
        } else if (field.type === 'custom-blocks') {
          // we always show custom blocks if they have a value. I.e we don't need to wait for a subtitle to be added.
          if (this.doesCustomBlockHaveAnyValues(spec, field)) {
            groups[field.name] = {
              fields: [field],
            };
          }
        } else if (field.type === 'textarea') {
          if (field.name.indexOf('PmNote') > -1) {
            // Only want to show PM notes if they have a value
            if (this.displayPmField(spec, section.name, field.name)) {
              // add to existing group if there is one,
              if (groups[field.canHide]) {
                groups[field.canHide].fields.push(field);
              } else {
                // else create a new one (this is because PM notes at start of section have no subtitle)
                groups[field.name] = {
                  fields: [field],
                };
              }
            }
          } else {
            // if not pm note field, simply add it
            groups[field.canHide]?.fields.push(field);
          }
        } else if (field.canHide) {
          // if not pm note field, simply add it
          groups[field.canHide]?.fields.push(field);
        } else {
          if (field.type === 'subtitle') {
            console.error(`${section.name} => field list must start with a subtitle`);
          }
          if (!field.canHide) {
            groups[section.name]?.fields.push(field);
          }
        }
      });
    }
    return values(groups);
  }

  displayConditional(spec, section, field) {
    return this.logicService.displayConditionalField(spec, section, field);
  }

  displayPmField(spec, section, field) {
    return this.logicService.displayPmField(spec, section, field);
  }

  // if the block has no values, or only a default value we don't want to show it.
  private doesCustomBlockHaveAnyValues(spec, field) {
    const blocks = spec[field.name];
    if (blocks.length > 1) {
      return true;
    }
    if (blocks.length === 1) {
      const keys = Object.keys(blocks[0]);
      const blockValue = blocks[0][keys[0]];
      // test for default value or empty string (two tests as database updates have been inconsistent)
      const isDefault = blockValue === field.default[keys[0]] || blockValue === '' || blockValue === ' ';
      const isDummy = keys[0] === 'dummy';
      return !(isDefault || isDummy);
    }
    return false;
  }
}
