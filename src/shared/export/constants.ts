export const detailsConfig = {
  fields: [
    {
      title: 'Client Details',
      name: 'details',
    },
    { name: 'scheme', display: 'Scheme' },
    { name: 'subdivision', display: 'Subdivision' },
    { name: 'client', display: 'Client Name' },
    { name: 'emails', display: 'Email' },
    { name: 'phones', display: 'Phone' },
    { name: 'consultantName', display: 'Sales Consultant' },
    { name: 'consultantPhone', display: 'Sales Consultant Phone' },
    {
      name: 'consultantEmail',
      display: 'Sales Consultant Email',
    },
    { name: 'projectManagerName', display: 'Project Manager' },
    { name: 'projectManagerPhone', display: 'Project Manager Phone' },
    { name: 'projectManagerEmail', display: 'Project Manager Email' },
  ],
};

//MAP between Venture DB and Freedom DB
export const SECTION_NAME_MAP = {
  appliances: 'specAppliances',
  blinds: 'specBlinds',
  'blinds-additional': 'specBlindsAdditional',
  cladding: 'specCladding',
  'cladding-additional': 'specCladdingAdditional',
  details: 'details',
  electrical: 'specElectrical',
  ensuite: 'specEnsuite',
  exterior: 'specExterior',
  floor: 'specFloor',
  'flooring-additional': 'specFloorAdditional',
  garage: 'specGarage',
  homeware: 'specHomeware',
  insulation: 'specInsulation',
  interior: 'specInterior',
  joinery: 'specJoinery',
  kitchen: 'specKitchen',
  landscape: 'specLandscape',
  laundry: 'specLaundry',
  layout: 'specLayout',
  mainBathroom: 'specBathroom',
  planning: 'specPlanning',
  section_details: 'sectionDetails',
  contact_details: 'specContactDetails',
  toilet: 'specToilet',
};

// on freedom images are under folders
export const IMAGE_MAP = {
  'towel-rail-rounded.png': 'bathroom',
  'toilet-roll-nemox.png': 'bathroom',
};
