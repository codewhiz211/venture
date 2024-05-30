// * This file defines the spec sections, what fields are present
// * All fields are optional unless required field set
// * All fields are text unless items field set

import { appliancesConfig } from './appliances';
import { blindsConfig } from './blinds';
import { claddingConfig } from './cladding';
import { contactDetailsConfig } from './contactDetails';
import { eletricalConfig } from './electrical';
import { ensuiteConfig } from './ensuite';
import { exteriorConfig } from './exterior';
import { floorConfig } from './floor';
import { garageConfig } from './garage';
import { homewareConfig } from './homeware';
import { insualtionConfig } from './insulation';
import { interiorConfig } from './interior';
import { joineryConfig } from './joinery';
import { kitchenConfig } from './kitchen';
import { landscapeConfig } from './landscape';
import { laundyConfig } from './laundry';
import { layoutConfig } from './layout';
import { mainBathroomConfig } from './main-bathroom';
import { planningConfig } from './planning';
import { sectionDetailsConfig } from './sectionDetails';
import { toiletConfig } from './toilet';

export const defaultSectionOrder = [
  'contact_details',
  'section_details',
  'planning',
  'layout',
  'exterior',
  'cladding',
  'joinery',
  'garage',
  'insulation',
  'interior',
  'kitchen',
  'appliances',
  'laundry',
  'mainBathroom',
  'toilet',
  'ensuite',
  'floor',
  'electrical',
  'blinds',
  'homeware',
  'landscape',
];

export const sectionConfig = [
  contactDetailsConfig,
  sectionDetailsConfig,
  planningConfig,
  layoutConfig,
  exteriorConfig,
  claddingConfig,
  joineryConfig,
  garageConfig,
  insualtionConfig,
  interiorConfig,
  kitchenConfig,
  appliancesConfig,
  laundyConfig,
  mainBathroomConfig,
  toiletConfig,
  ensuiteConfig,
  floorConfig,
  eletricalConfig,
  blindsConfig,
  homewareConfig,
  landscapeConfig,
];
