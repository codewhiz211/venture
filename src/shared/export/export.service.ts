import { IMAGE_MAP, SECTION_NAME_MAP, detailsConfig } from './constants';
import { clone, compose, forEach, isEmpty, keys, path, pickBy, without } from 'ramda';
import {
  getConfig,
  getCustomSections,
  getSectionGroups,
  isAdditionalSection,
  isGroupedBySubtitle,
  objectValuesToArray,
  withoutEmpty,
  withoutEmptyGrouped,
  withoutErrors,
  withoutHints,
  withoutIgnoredFields,
  withoutIgnoredSections,
} from './helpers';

import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import appliancesConfig from '../config/spec-config/appliances';
import { blindsConfig } from '../config/spec-config/blinds';
import { catchError } from 'rxjs/operators';
import claddingConfig from '../config/spec-config/cladding';
import { colours } from '../config/spec-config/colours';
import { eletricalConfig } from '../config/spec-config/electrical';
import { ensuiteConfig } from '../config/spec-config/ensuite';
import exteriorConfig from '../config/spec-config/exterior';
import { floorConfig } from '../config/spec-config/floor';
import garageConfig from '../config/spec-config/garage';
import { homewareConfig } from '../config/spec-config/homeware';
import { imagesList } from '../config/spec-config/images';
import { insualtionConfig } from '../config/spec-config/insulation';
import interiorConfig from '../config/spec-config/interior';
import joineryConfig from '../config/spec-config/joinery';
import kitchenConfig from '../config/spec-config/kitchen';
import landscapeConfig from '../config/spec-config/landscape';
import { laundyConfig } from '../config/spec-config/laundry';
import { layoutConfig } from '../config/spec-config/layout';
import mainBathroomConfig from '../config/spec-config/main-bathroom';
import { planningConfig } from '../config/spec-config/planning';
import { sectionConfig } from '../config/spec-config';
import { sectionDetailsConfig } from '../config/spec-config/sectionDetails';
import { throwError } from 'rxjs';
import { toiletConfig } from '../config/spec-config/toilet';
import { APP_CONFIG } from 'app.config';
import { contactDetailsConfig } from '@shared/config/spec-config/contactDetails';
import createLogger from 'debug';

const logger = createLogger('ven:common:export');

/*
  Export a venture Community Spec, such that it can be imported to Freedom.
  Ideally the conversion would be done on the server, but it requires access to the venture/spec-configs
  Long term, perhaps we can move these to the DB..
  */
@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private config;

  constructor(@Inject(APP_CONFIG) config, private http: HttpClient) {
    this.config = config;
  }

  public exportSpec(spec, lot) {
    const specUid = spec.uid;
    const exported = exportVentureSpecForFreedom(spec);
    exported.meta.lot = lot;

    logger(exported);
    return this.exportToFreedom(specUid, exported);
  }

  private exportToFreedom(specUid, spec) {
    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/app/exportToFreedom`;
    return this.http.post(endpoint, spec, { params: { specUid } }).pipe(catchError(this.handleError));
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body: any = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return throwError(errMsg);
  }
}

// TODO
// * ignore fields in hidden sub sections

export function exportVentureSpecForFreedom(spec) {
  const withoutHidden = pickBy((val, key) => {
    return !(spec.hiddenSections[key] === true);
  });

  function doExport() {
    const customSectionKeys = getCustomSections(spec);

    const sections = compose(without(customSectionKeys), keys, withoutIgnoredSections, withoutHidden)(spec);

    const output: any = {};

    forEach((sectionKey) => {
      if (isAdditionalSection(sectionKey)) {
        const config = getConfig(sectionKey);
        output[SECTION_NAME_MAP[sectionKey]] = convertAdditionalSection(config, sectionKey, spec[sectionKey]);
      } else if (isGroupedBySubtitle(sectionKey)) {
        const config = getConfig(sectionKey);
        output[SECTION_NAME_MAP[sectionKey]] = convertGroupedSection(config, sectionKey, spec[sectionKey]);
      } else if (sectionKey !== 'custom_sections') {
        output[SECTION_NAME_MAP[sectionKey]] = convertSection(sectionKey, spec[sectionKey]);
      }
    }, sections);

    // add in any custom sections
    forEach((sectionKey) => {
      output[sectionKey] = convertSection(sectionKey, spec[sectionKey]);
    }, customSectionKeys);

    // freedom expects this to exist
    output.meta = {
      clientName: spec.contact_details.client,
      subdivision: spec.section_details.subdivision,
      hiddenSections: {
        keep: true,
      },
    };

    // freedom expects this to exist
    output.specHeader = {
      status: 'Quote',
      village: 'Freedom Communal',
      clientName: spec.contact_details.client,
      plan: 'Communal',
    };

    return output;
  }

  /**
   * Converts a Venture Spec section into a format that can be read by Freedom
   * The spec is as per database and as such only stores the values, not the label, image, hex colour value
   * that was used in the UI.
   * As part of conversion we add this information
   */
  function convertSection(sectionName, section) {
    // this list is quite long because we handle custom sections which have a ton of meta fields on them
    const fields = withoutIgnoredFields(keys(section));

    const converted: any = convertFields(fields, sectionName, section);

    converted.title = getSectionTitle(spec, sectionName);

    converted.order = getSectionOrder(spec, sectionName);

    // need to display free text section in full width in freedom
    if (section?.type === 'FREE') {
      converted.type = 'FREE';
    }

    return compose(withoutEmpty, withoutHints, withoutErrors)(converted);
  }

  /**
   * Same as the previous section, but handles additional "custom" block sections of the spec
   */
  function convertAdditionalSection(config, sectionName, section) {
    const blocks = objectValuesToArray(clone(section));

    const convertedBlocks = [];

    forEach((block) => {
      const blockFields = withoutIgnoredFields(keys(block));
      const convertedBlockFields = convertFieldsForAdditionalSection(blockFields, sectionName, block, config);
      convertedBlocks.push({
        block: convertedBlocks.length,
        fields: compose(withoutEmpty, withoutHints, withoutErrors)(convertedBlockFields),
      });
    }, blocks);

    const converted = {
      blocked: true,
      order: getSectionOrder(spec, sectionName),
      title: getSectionTitle(spec, sectionName),
      blocks: convertedBlocks,
    };

    return withoutEmpty(converted);
  }

  /**
   * Same as the previous section, but handles sections that are grouped by subtitle
   */
  function convertGroupedSection(config, sectionName, section) {
    const withoutHiddenGroups = pickBy((val, key) => {
      if (spec.hiddenSections[sectionName] === undefined || spec.hiddenSections[sectionName] === false) {
        return true;
      }
      return !spec.hiddenSections[sectionName][val.name] === true;
    });

    const groups = withoutHiddenGroups(getSectionGroups(config, spec.custom_fields));

    const convertedGroups = [];

    forEach((group) => {
      const groupFields = withoutIgnoredFields(group.fields);
      const convertedGroupFields = convertFieldsForGroupedSection(groupFields, sectionName, section, group);
      convertedGroups.push({
        group: convertedGroups.length,
        fields: compose(withoutEmptyGrouped)(convertedGroupFields),
        title: group.title,
      });
    }, Object.values(groups));

    const converted = {
      grouped: true,
      order: getSectionOrder(spec, sectionName),
      title: getSectionTitle(spec, sectionName),
      groups: convertedGroups,
    };

    return withoutEmpty(converted);
  }

  /**
   * Convert the list of fields provided, adding appropriate label information etc
   * @param fields - a list of field KEYS
   * @param sectionName
   * @param section  - the spec section that contains the values for the keys provided
   */
  function convertFields(fields, sectionName, section) {
    const converted: any = {};
    forEach((fieldName) => {
      converted[fieldName] = getFieldValue(sectionName, fieldName, section, getFieldLabel(section, sectionName, fieldName));
    }, fields);
    return converted;
  }

  function convertFieldsForAdditionalSection(fields, sectionName, section, config) {
    const converted: any = {};
    forEach((fieldName) => {
      converted[fieldName] = getFieldValue(sectionName, fieldName, section, getFieldLabel(section, sectionName, fieldName), config);
    }, fields);
    return converted;
  }

  function convertFieldsForGroupedSection(fields, sectionName, section, group) {
    const converted: any = {};
    forEach((fieldName) => {
      converted[fieldName] = getFieldValue(sectionName, fieldName, section, getFieldLabel(group, sectionName, fieldName));
    }, fields);
    return converted;
  }

  /**
   * Does the hard work of adding in labels, asset names, etc
   */
  function getFieldValue(sectionName, fieldName, section, label, config = null) {
    if (!fieldName) {
      return undefined;
    }
    const searchedSection = sectionConfig.find((item) => item.name === sectionName);
    const fields = searchedSection ? searchedSection.fields : undefined;
    // Plus one because Freedom is expecting 1 or above (as is `if (fieldOrder) {` below)
    // This change means we don't need to update Freedom too.
    const fieldOrder = fields ? fields.findIndex((item) => item.name === fieldName) + 1 : undefined;

    let value = section[fieldName];

    if (value === undefined) {
      return undefined;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return undefined;
      }
      if (value.filter((v) => !isEmpty(v)).length === 0) {
        return undefined;
      }
    }

    // TODO return undefined for ignored fields

    const hint = section[`${fieldName}_hint`];
    const order = getFieldOrder(config, fieldName);
    const canHide = getCanHide(config, fieldName);

    if (fieldName.toLowerCase().includes('colour')) {
      return getColourFieldValue(value, label, hint, order || fieldOrder, canHide);
    }

    const image = fieldImage(value);
    if (image) {
      return getImageFieldValue(label, image, hint, order || fieldOrder, canHide);
    }

    // standard field
    const field: any = {
      label,
      value,
    };

    if (fieldOrder) {
      field.order = fieldOrder;
    }

    if (hint) {
      field.hint = hint;
    }
    if (order !== undefined) {
      field.order = order;
    }
    return field;
  }

  /*
    If there is an image associated with the value, return it
*/
  function fieldImage(fieldName) {
    const images = imagesList();
    return images.find((i) => i.id === fieldName);
  }

  /**
   *  Look up the appropriate label and hex value from the colours config
   */
  function getColourFieldValue(field, label, hint, order, canHide) {
    const colourField: any = {
      label,
    };
    if (hint) {
      colourField.hint = hint;
    }
    if (order) {
      colourField.order = order;
    }
    if (canHide) {
      colourField.canHide = canHide;
    }
    const colour = colours.find((c) => c.id === field);
    if (colour) {
      // TODO V2 don't return for V1
      //colourField.hex = colour.hex;
      colourField.name = colour.display;
      colourField.value = colour.display; // TODO name, value or both??
    } else {
      // some colours are manually entered and will not be listed in colours
      colourField.value = field;
    }
    return colourField;
  }

  /**
   *  Look up the appropriate label and image filename from the images array
   */
  function getImageFieldValue(label, image, hint, order, canHide) {
    if (!image.url && !image.urls) {
      console.error(`could not find image for ${label}`);
    }

    let imageName;
    let extension;
    if (image.url) {
      imageName = image.url.split('/').pop();
      extension = image.url.substr(image.url.lastIndexOf('.') + 1);
    }
    if (image.urls) {
      // TODO handle multiple images
      imageName = image.urls[0].split('/').pop();
      extension = image.urls[0].substr(image.urls[0].lastIndexOf('.') + 1);
    }

    const freedomAssetPath = `/assets/img/${IMAGE_MAP[imageName]}/${imageName}`;

    // just return the filename, images are stored in different location in Freedom
    const imageField: any = {
      label,
      // TODO V2 don't return for V1
      //url: freedomAssetPath,
      name: image.display,
      value: image.display, // TODO name, value or both??
    };
    if (hint) {
      imageField.hint = hint;
    }
    if (order) {
      imageField.order = order;
    }
    if (canHide) {
      imageField.canHide = canHide;
    }
    return imageField;
  }

  /**
   * Look up label used by Venture for this field from the section config
   */
  function getFieldLabel(section, sectionName, fieldName) {
    const findLabel = (labels, fieldName) => {
      const field = labels.find((lbl) => lbl.name === fieldName);
      return field ? field.display : `Label not found for ${sectionName}-${fieldName}`;
    };

    if (section.type === 'DUPLICATE') {
      return findLabel(section.fields, fieldName);
    }
    if (section.type === 'FREE') {
      return 'Info';
    }

    switch (sectionName) {
      case 'appliances':
        return findLabel(appliancesConfig.fields, fieldName);

      case 'blinds':
        return findLabel(blindsConfig.fields, fieldName);

      case 'blinds-additional':
        const blindsAdditionalConfig = blindsConfig.fields.find((f) => f.name === 'blinds-additional');
        if (blindsAdditionalConfig) {
          return findLabel(blindsAdditionalConfig.blockFields, fieldName);
        }
        return `Label not found for missing additional section ${sectionName}`;

      case 'cladding':
        return findLabel(claddingConfig.fields, fieldName);
      case 'cladding-additional':
        const additionalCladdingConfig = claddingConfig.fields.find((f) => f.name === 'cladding-additional');
        if (additionalCladdingConfig) {
          return findLabel(additionalCladdingConfig.blockFields, fieldName);
        }
        return `Label not found for missing additional section ${sectionName}`;

      case 'details':
        return findLabel(detailsConfig.fields, fieldName);
      case 'electrical':
        return findLabel(eletricalConfig.fields, fieldName);
      case 'ensuite':
        return findLabel(ensuiteConfig.fields, fieldName);
      case 'exterior':
        return findLabel(exteriorConfig.fields, fieldName);

      case 'floor':
        return findLabel(floorConfig.fields, fieldName);
      case 'flooring-additional':
        const additionalFloorConfig = floorConfig.fields.find((f) => f.name === 'flooring-additional');
        if (additionalFloorConfig) {
          return findLabel(additionalFloorConfig.blockFields, fieldName);
        }
        return `Label not found for missing additional section ${sectionName}`;

      case 'garage':
        return findLabel(garageConfig.fields, fieldName);
      case 'homeware':
        return findLabel(homewareConfig.fields, fieldName);
      case 'interior':
        return findLabel(interiorConfig.fields, fieldName);
      case 'insulation':
        return findLabel(insualtionConfig.fields, fieldName);
      case 'laundry':
        return findLabel(laundyConfig.fields, fieldName);
      case 'joinery':
        return findLabel(joineryConfig.fields, fieldName);
      case 'kitchen':
        return findLabel(kitchenConfig.fields, fieldName);
      case 'landscape':
        return findLabel(landscapeConfig.fields, fieldName);
      case 'layout':
        return findLabel(layoutConfig.fields, fieldName);
      case 'mainBathroom':
        return findLabel(mainBathroomConfig.fields, fieldName);
      case 'planning':
        return findLabel(planningConfig.fields, fieldName);
      case 'section_details':
        return findLabel(sectionDetailsConfig.fields, fieldName);
      case 'toilet':
        return findLabel(toiletConfig.fields, fieldName);
      case 'contact_details':
        return findLabel(contactDetailsConfig.fields, fieldName);
    }
    return `Label not found for missing section ${sectionName}`;
  }

  function getSectionOrder(spec, sectionName) {
    if (!path(['sort', 'orderList'], spec)) {
      return undefined;
    }

    // Both Floor and Flooring Additional need to be displayed, Additional should be after Floor
    if (sectionName === 'flooring-additional') {
      let order = spec.sort.orderList.findIndex((name) => name === 'floor');
      if (order >= 0) {
        order = order + 0.5;
      }
      return order >= 0 ? order : undefined;
    }

    if (sectionName === 'blinds-additional') {
      let order = spec.sort.orderList.findIndex((name) => name === 'blinds');
      if (order >= 0) {
        order = order + 0.5;
      }
      return order >= 0 ? order : undefined;
    }

    if (sectionName === 'cladding-additional') {
      let order = spec.sort.orderList.findIndex((name) => name === 'cladding');
      if (order >= 0) {
        order = order + 0.5;
      }
      return order >= 0 ? order : undefined;
    }

    const order = spec.sort.orderList.findIndex((name) => name === sectionName);
    return order >= 0 ? order : undefined;
  }

  function getFieldOrder(config, fieldName) {
    let order;
    if (config) {
      const sectionName = config.name === 'floor' ? 'flooring-additional' : `${config.name}-additional`;
      // attach field order
      const blockInfo = config.fields.find((f) => f.name === sectionName);
      if (blockInfo) {
        const field = blockInfo.blockFields.find((f) => f.name === fieldName);
        if (field) {
          order = field.order;
        } else {
          //console.log(`could not find order for ${fieldName}`);
        }
      } else {
        console.error(`could not find block info for ${config.name}`);
      }
    }

    return order;
  }

  function getCanHide(config, fieldName) {
    let canHide;
    if (config) {
      const sectionName = config.name === 'floor' ? 'flooring-additional' : `${config.name}-additional`;
      // attach field order
      const blockInfo = config.fields.find((f) => f.name === sectionName);
      if (blockInfo) {
        const field = blockInfo.blockFields.find((f) => f.name === fieldName);
        if (field) {
          canHide = field.canHide;
        } else {
          console.log(`could not find canHide for ${fieldName}`);
        }
      } else {
        console.error(`could not find block info for ${config.name}`);
      }
    }

    return canHide;
  }

  function getSectionTitle(spec, sectionName) {
    if (spec[sectionName].title) {
      return spec[sectionName].title;
    }

    switch (sectionName) {
      case 'appliances':
        return appliancesConfig.title;
      case 'blinds':
        return blindsConfig.title;
      case 'blinds-additional':
        return blindsConfig.title;
      case 'cladding':
        return claddingConfig.title;
      case 'cladding-additional':
        return claddingConfig.title;
      case 'contact_details':
        return contactDetailsConfig.title;
      case 'details':
        return 'Client Details';
      case 'electrical':
        return eletricalConfig.title;
      case 'ensuite':
        return ensuiteConfig.title;
      case 'exterior':
        return exteriorConfig.title;
      case 'floor':
        return floorConfig.title;
      case 'flooring-additional':
        return 'Additional Floor Coverings';
      case 'garage':
        return garageConfig.title;
      case 'homeware':
        return homewareConfig.title;
      case 'interior':
        return interiorConfig.title;
      case 'insulation':
        return insualtionConfig.title;
      case 'laundry':
        return laundyConfig.title;
      case 'joinery':
        return joineryConfig.title;
      case 'kitchen':
        return kitchenConfig.title;
      case 'landscape':
        return landscapeConfig.title;
      case 'layout':
        return layoutConfig.title;
      case 'mainBathroom':
        return mainBathroomConfig.title;
      case 'planning':
        return planningConfig.title;
      case 'section_details':
        return sectionDetailsConfig.title;
      case 'toilet':
        return toiletConfig.title;
    }
  }

  return doExport();
}
