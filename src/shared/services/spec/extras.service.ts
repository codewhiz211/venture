import { GstService } from './gst.service';
import { Injectable } from '@angular/core';
import { sectionConfig } from '../../config/spec-config';

@Injectable({
  providedIn: 'root',
})
export class ExtrasService {
  constructor(private gstService: GstService) {}

  /**
   * returns an object, where each key is a section, and each value is a list of extras for that section
   * @param spec
   */
  public getAllExtraSections(spec) {
    // there are three types of extra
    // each section can have zero or more of each configured
    // additionally there can be custom (userd added) sections

    // get a list of custom sections (name, title)
    const customSections = [];
    if (spec['custom_sections']) {
      const customSectionKeys = Object.keys(spec['custom_sections']);
      customSectionKeys.forEach((key) => {
        customSections.push({ name: key, title: spec['custom_sections'][key] });
      });
    }
    const allSections = sectionConfig.concat(customSections);
    const allSectionExtras = {};

    // loop through all sections and find any extras configured, if any
    allSections.forEach((section: any) => {
      let sectionExtras = [];

      sectionExtras = sectionExtras.concat(this.getAutoAddedExtras(spec, section.name));
      sectionExtras = sectionExtras.concat(this.getManualExtras(spec, section.name));
      sectionExtras = sectionExtras.concat(this.getOptionalExtras(spec, section.name));
      if (section.hasCustom) {
        sectionExtras = sectionExtras.concat(this.getCustomExtras(spec, section.name));
      }
      if (sectionExtras.length > 0) {
        // now we have all extra variants, add for this section
        const withoutDummies = sectionExtras.filter((e) => !e.dummy);
        allSectionExtras[section.name] = {
          title: section.title,
          extras: withoutDummies,
          total: withoutDummies.reduce(this.reducer, 0),
        };
      }
    });

    return allSectionExtras;
  }
  //TODO replace with getallextras
  public getPostContractExtras(spec, sections?) {
    // there are three types of extra
    // each section can have zero or more of each configured
    const extras = [];
    let foundExtras = [];
    const _sections = sections || sectionConfig;
    if (spec['extras'] || spec['extras_manual'] || spec['extras_optional']) {
      _sections.forEach((section: any) => {
        foundExtras = [];
        // first check to see if there are any auto added extras
        const sectionExtras = spec['extras'][section.name];
        if (sectionExtras && sectionExtras !== ' ') {
          foundExtras = foundExtras.concat(sectionExtras);
        }
        // now check to see if any manually added extras
        const manualExtras = spec['extras_manual'][section.name];
        if (manualExtras && manualExtras !== ' ') {
          foundExtras = foundExtras.concat(manualExtras);
        }
        // now check to see if any extras added with dropdowns
        const optionalExtras = spec['extras_optional'][section.name];
        if (optionalExtras && optionalExtras !== ' ') {
          foundExtras = foundExtras.concat(optionalExtras);
        }

        // if the section has a custom block, grab any extras for it also
        // custom sections are now fields, capable of being defined anywhere in the spec
        // they can also have custom names, but will always start with `${section.name}-custom
        if (section.hasCustom) {
          const customSection: any = _sections.filter((s) => s.name === section.name)[0];
          const customFields = customSection.fields.filter((f) => f.type === 'custom-blocks');
          customFields.forEach((f) => {
            if (spec[f.name] === undefined) {
              return;
            }
            if (typeof spec[f.name] === 'object') {
              // data merges locally and is an object
              Object.keys(spec[f.name]).forEach((extraKey, idx) => {
                const customExtras = spec['extras'][`${f.name}^${idx}`];
                if (customExtras && customExtras !== ' ') {
                  foundExtras = foundExtras.concat(customExtras);
                }
              });
            } else {
              // data has come from server and is an array
              spec[f.name].forEach((block, idx) => {
                const customExtras = spec['extras'][`${f.name}^${idx}`];
                if (customExtras && customExtras !== ' ') {
                  foundExtras = foundExtras.concat(extras);
                }
              });
            }
          });
        }
        if (foundExtras.length > 0) {
          // now we have all extra variants, add for this section
          const postContractExtras = foundExtras.filter((e) => e.postContract);

          const withoutDummies = postContractExtras.filter((e) => !e.dummy);
          if (withoutDummies.length > 0) {
            const _withoutDummies = withoutDummies.map((el) => {
              const breakdown = this.gstService.getBreakdown(el.amount);
              return {
                ...el,
                gross: breakdown.gross,
                net: breakdown.net,
                gst: breakdown.gst,
              };
            });
            extras[section.name] = {
              extras: _withoutDummies,
              title: section.title,
              total: _withoutDummies.reduce(this.reducer(spec.quote.includeGST), 0),
            };
          }
        }
      });
    }
    return extras;
  }
  //TODO replace with getallextras
  public getPreContractExtras(spec, sections?) {
    // there are three types of extra
    // each section can have zero or more of each configured

    const extras = [];
    let foundExtras = [];
    const _sections = sections || sectionConfig;
    if (spec['extras'] || spec['extras_manual'] || spec['extras_optional']) {
      _sections.forEach((section: any) => {
        foundExtras = [];
        // first check to see if there are any auto added extras
        const sectionExtras = spec['extras'][section.name];
        if (sectionExtras && sectionExtras !== ' ') {
          foundExtras = foundExtras.concat(sectionExtras);
        }
        // now check to see if any manually added extras
        const manualExtras = spec['extras_manual'][section.name];
        if (manualExtras && manualExtras !== ' ') {
          foundExtras = foundExtras.concat(manualExtras);
        }
        // now check to see if any extras added with dropdowns
        const optionalExtras = spec['extras_optional'][section.name];
        if (optionalExtras && optionalExtras !== ' ') {
          foundExtras = foundExtras.concat(optionalExtras);
        }

        // if the section has a custom block, grab any extras for it also
        if (section.hasCustom) {
          const customSection: any = _sections.filter((s) => s.name === section.name)[0];
          const customFields = customSection.fields.filter((f) => f.type === 'custom-blocks');
          customFields.forEach((f) => {
            if (spec[f.name] === undefined) {
              return;
            }
            if (typeof spec[f.name] === 'object') {
              // data merges locally and is an object
              Object.keys(spec[f.name]).forEach((extraKey, idx) => {
                const customExtras = spec['extras'][`${f.name}^${idx}`];
                if (customExtras && customExtras !== ' ') {
                  foundExtras = foundExtras.concat(customExtras);
                }
              });
            } else {
              // data has come from server and is an array
              spec[f.name].forEach((block, idx) => {
                const customExtras = spec['extras'][`${f.name}^${idx}`];
                if (customExtras && customExtras !== ' ') {
                  foundExtras = foundExtras.concat(extras);
                }
              });
            }
          });
        }
        if (foundExtras.length > 0) {
          // now we have all extra variants, add for this section
          const postContractExtras = foundExtras.filter((e) => !e.postContract);
          const withoutDummies = postContractExtras.filter((e) => !e.dummy);
          const _withoutDummies = withoutDummies.map((el) => {
            const breakdown = this.gstService.getBreakdown(el.amount);
            return {
              ...el,
              gross: breakdown.gross,
              net: breakdown.net,
              gst: breakdown.gst,
            };
          });
          if (_withoutDummies.length > 0) {
            extras[section.name] = {
              extras: withoutDummies,
              title: section.title,
              total: _withoutDummies.reduce(this.reducer(spec.quote.includeGST), 0),
            };
          }
        }
      });
    }
    return extras;
  }

  public getAllExtras(spec) {
    let extras = [];
    const extraSections = this.getAllExtraSections(spec);
    Object.keys(extraSections).forEach((extraKey) => {
      extras = extras.concat(extraSections[extraKey].extras);
    });

    return this.filterOutDummies(extras);
  }

  public getAllPostContractExtras(spec) {
    const extras = this.getAllExtras(spec);
    const withoutDummies = this.filterOutDummies(extras);
    return this.filterByContractState(withoutDummies, true);
  }

  public getAllPreContractExtras(spec) {
    const extras = this.getAllExtras(spec);
    const withoutDummies = this.filterOutDummies(extras);
    return this.filterByContractState(withoutDummies, false);
  }

  private filterByContractState(extras, postContract) {
    return extras.filter((extra) => (postContract ? extra.postContract : !extra.postContract));
  }

  private filterOutDummies(extras) {
    return extras.filter((e) => !e.dummy);
  }

  private reducer(includeGst = true) {
    return (accumulator, currentValue) => {
      const amount = includeGst ? currentValue.gross : currentValue.net;
      return accumulator + parseFloat(amount);
    };
  }

  // find any auto added extras
  private getAutoAddedExtras(spec, sectionName) {
    if (!spec['extras']) return [];
    const sectionExtras = spec['extras'][sectionName];
    if (sectionExtras && sectionExtras !== ' ') {
      return sectionExtras.map((e, i) => {
        e.section = sectionName;
        e.type = 'extras';
        e.fieldIndex = i;
        return e;
      });
    }
    return [];
  }

  // find any manually added extras
  private getManualExtras(spec, sectionName) {
    if (!spec['extras_manual']) return [];
    const sectionExtras = spec['extras_manual'][sectionName];
    if (sectionExtras && sectionExtras !== ' ') {
      return sectionExtras.map((e, i) => {
        e.section = sectionName;
        e.type = 'extras_manual';
        e.fieldIndex = i;
        return e;
      });
    }
    return [];
  }
  // find any extras added with dropdowns
  private getOptionalExtras(spec, sectionName) {
    if (!spec['extras_optional']) return [];
    const sectionExtras = spec['extras_optional'][sectionName];
    if (sectionExtras && sectionExtras !== ' ') {
      return sectionExtras.map((e, i) => {
        e.section = sectionName;
        e.type = 'extras_optional';
        e.fieldIndex = i;
        return e;
      });
    }
    return [];
  }

  // find any extras added within custom blocks (E.g. Cladding additional)
  private getCustomExtras(spec, sectionName) {
    const customSection: any = sectionConfig.filter((s) => s.name === sectionName)[0];
    const customFields = customSection.fields.filter((f) => f.type === 'custom-blocks');
    let customExtras = [];
    customFields.forEach((f) => {
      if (spec[f.name] === undefined) {
        return;
      }
      if (typeof spec[f.name] === 'object') {
        // data merges locally and is an object
        Object.keys(spec[f.name]).forEach((extraKey, idx) => {
          let foundExtras = spec['extras'][`${f.name}^${idx}`];
          if (foundExtras && foundExtras !== ' ') {
            foundExtras = foundExtras.map((e) => {
              // custom blocks are in special section called <section>-additional
              e.section = `${`${sectionName}-additional`}^${idx}`;
              e.type = 'extras';
              return e;
            });
            customExtras = customExtras.concat(foundExtras);
          }
        });
      } else {
        // data has come from server and is an array
        spec[f.name].forEach((block, idx) => {
          let foundExtras = spec['extras'][`${f.name}^${idx}`];
          if (foundExtras && foundExtras !== ' ') {
            foundExtras = foundExtras.map((e, i) => {
              // custom blocks are in special section called <section>-additional
              e.section = `${`${sectionName}-additional`}^${idx}`;
              e.type = 'extras';
              e.fieldIndex = i;
              return e;
            });
            customExtras = customExtras.concat(foundExtras);
          }
        });
      }
    });
    return customExtras;
  }
}
