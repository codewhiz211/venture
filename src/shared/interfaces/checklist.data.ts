export enum CheckItemType {
  call = 0,
  checkHeading = 1,
  heading = 2,
  freeText = 3,
  item = 4,
  note = 5,
}

export interface Checklist {
  name: string;
  id?: number;
  complete: boolean; // Whether the checklist has been completed
  completed: number; // How many items have been checked off
  length: number; // How many items in the items array which are checkable. (Some items in the array aren't checkable, e.g. headings)
  items: ChecklistItem[];
  actionRequired: boolean;
  signed?: string;
}

export interface ChecklistItem {
  name: string;
  type: CheckItemType;
  complete?: boolean; // Complete isn't required for non-checkable items like headings
  value?: string; // The text value of freeText item type
  furtherAction?: boolean; // Whether freeText needs further attention,
  actionRequired?: boolean;
  actionRequiredText?: string;
}

export const checklistJson: Checklist[] = [
  {
    id: 1,
    name: 'Meet and Greet',
    complete: false,
    completed: 0,
    length: 17,
    actionRequired: false,
    items: [
      {
        name: 'Site plan',
        type: CheckItemType.heading,
      },
      {
        name: 'House position on site',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Vehicle Crossing',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Concrete area',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Exterior Taps',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Floor Layout',
        type: CheckItemType.heading,
      },
      {
        name: 'House walk through',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Swing and Arc of doors and',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Check Floor coverings',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Overlay Kitchen designs',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Bathroom and Ensuite Configs',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Explain Wardrobe designs',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Elevations',
        type: CheckItemType.heading,
      },
      {
        name: 'Exterior Door and Window Configs',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Roof',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Cladding Areas',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Run through check sheet',
        type: CheckItemType.checkHeading,
        complete: false,
      },
      {
        name: 'Discuss onsite meetings',
        type: CheckItemType.checkHeading,
        complete: false,
      },
      {
        name: 'Discuss onsite H+S',
        type: CheckItemType.checkHeading,
        complete: false,
      },
      {
        name: 'Discuss expectations of communication throughout build',
        type: CheckItemType.checkHeading,
        complete: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Floor Down Inspection',
    complete: false,
    completed: 0,
    length: 15,
    actionRequired: false,
    items: [
      {
        name: 'Check water meter & cracked concrete paths or vehicle crossings',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Site pack-plan and spec onsite',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Site excavated to correct height',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Skip, portaloo and correct signage onsite',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Boxing positioned correctly onsite',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Boxing straight, braced and all rebates in',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Fall on garage door rebate',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Pods, steel and slab thickenings as per plan',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Ducts for meter box, water and earth pin',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'All pipework complete',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Bottom plate anchors in and spaced correctly',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Concrete in',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Boxing removed',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Poly for shower wastes',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Call Client',
        type: CheckItemType.call,
        complete: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Roof Complete Fixing Inspection',
    complete: false,
    completed: 0,
    length: 7,
    actionRequired: false,
    items: [
      {
        name: 'Scaffold complete and tagged, nets up',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'All trusses up and correct fixings on',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Soffit framing in',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Lintel fixings, frame fixings in for fixing inspection',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Purlins, Blue Screws, Strap Brace',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Drainage complete',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Call Client to arrange site visit 1',
        type: CheckItemType.call,
        complete: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Closed-In Inspection',
    complete: false,
    completed: 0,
    length: 13,
    actionRequired: false,
    items: [
      {
        name: 'Windows fixed and packed correctly',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Battens installed, ceiling nogs where needed',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Kitchen measure done',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Prepipe/prewire complete',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Bath/shower bases in',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Any additional nogging',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Walls straightened',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Bricks complete',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Insulation in specified areas',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'PEF rod/ foam',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Roof complete including all flashings',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Gib order received (note cove, bullnose corners)',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Call Client to arrange site visit 2',
        type: CheckItemType.call,
        complete: false,
      },
    ],
  },
  {
    id: 5,
    name: 'PM Pre Fix Check',
    complete: false,
    completed: 0,
    length: 6,
    actionRequired: false,
    items: [
      {
        name: 'Before any fixing commences the framing is to be checked to ensure fixing is in accordance with Gib specification. Ensure the Project Manager & Gib fixer are onsite to ensure any issues are remedied in a timely manner e.g. prior to builder leaving site.',
        type: CheckItemType.note,
        complete: false,
      },
      {
        name: 'Has framing surface been checked for flatness? i.e. no protruding studs, nogs, lintels etc.?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Is the moisture content acceptable i.e. 18% or less (see p. 30)?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Are grooved jambs set up correctly to allow 1–1.5mm clearance for sheet edge?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Are all ceiling battens running in same direction within room spaces?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Pre line inspection passed?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Final colour scheme signed?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Once the framing has been checked & Accepted by the fixer it is the fixer’s responsibility to remedy any issues.',
        type: CheckItemType.note,
        complete: false,
      },
    ],
  },
  {
    id: 6,
    name: 'Painting Supervisors Pre-Stop Check',
    complete: false,
    completed: 0,
    length: 11,
    actionRequired: false,
    items: [
      {
        name: 'Before any stopping commences the framing is to be checked to ensure fixing is in accordance with the Gib specification. Ensure the Project Manager & Gib Stopper are onsite to ensure any issues are remedied in a timely manner e.g. prior to fixer leaving site.',
        type: CheckItemType.note,
        complete: false,
      },
      {
        name: 'Have the number and length of joints been kept to a minimum?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Has the lineal meterage of joints been kept to a minimum?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Has the board been fixed horizontally wherever practical?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Correct fasteners used?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Fastenings (nails or screws) have not been overdriven?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'No joints above or below the edges of windows or doors?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'No fastenings to sheet centres on walls? (Not applicable to Fire Rated systems or tiled surfaces)',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Butt joints in ceiling back blocked where required?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Correct size and spacing of glue daubs? (If viewed during installation)',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Only paper tape used on stopping joints',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Pre Stop inspection passed?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Once the fixing has been checked & Accepted by the stopper it is the stopper’s responsibility to remedy any issues.',
        type: CheckItemType.note,
        complete: false,
      },
      {
        name: 'NOTE: Ensure paint products have been ordered with delivery to the office for checking by Supervisor prior to delivering to site.',
        type: CheckItemType.note,
        complete: false,
      },
    ],
  },
  {
    id: 7,
    name: 'Painting Supervisors Pre Paint Check',
    complete: false,
    completed: 0,
    length: 5,
    actionRequired: false,
    items: [
      {
        name: 'Before any painting commences the stopping is to be checked to ensure the stopping is in accordance with Gib specification. Ensure the Project Manager & Painter are onsite to ensure any issues are remedied in a timely manner e.g. prior to the stopper leaving site.',
        type: CheckItemType.note,
        complete: false,
      },
      {
        name: 'Surface free of visible trowel marks or defects?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Has all the cladding been completed?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Trim completed & to VDL standards?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Have all jambs & liners been checked for defects?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'All stopping 100% completed?',
        type: CheckItemType.item,
        complete: false,
      },
    ],
  },
  {
    id: 8,
    name: 'Painting Supervisors Pre-Start Meeting',
    complete: false,
    completed: 0,
    length: 8,
    actionRequired: false,
    items: [
      {
        name: 'Once the fixing has been checked & Accepted by the stopper it is the stopper’s responsibility to remedy any issues.',
        type: CheckItemType.note,
        complete: false,
      },
      {
        name: 'Roll call',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Hi Vis, worn',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Signed in',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Check hazards',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Scaffolding in place and tagged',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Products & consumables checked',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Expected duration advised',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Painting duration sheets given',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'NOTE: Ensure painting durations and expectations are outlined and completed to ensure accurate record keeping for future projects.',
        type: CheckItemType.note,
        complete: false,
      },
    ],
  },
  {
    id: 9,
    name: 'Painting Supervisors Mid-Paint Check',
    complete: false,
    completed: 0,
    length: 4,
    actionRequired: false,
    items: [
      {
        name: 'Prior to the painters completion the Supervisor is to check the partially completed works to ensure they are inline with VDL’s expectation and the Dulux painting specification.',
        type: CheckItemType.note,
        complete: false,
      },
      {
        name: 'Venture painting processes are being used?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Workmanship is of a high standard?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Time frame being meet, kitchen install date ok?',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Exterior painting underway & quality checked?',
        type: CheckItemType.item,
        complete: false,
      },
    ],
  },
  {
    id: 10,
    name: 'Painting Supervisors Final Paint Check',
    complete: false,
    completed: 0,
    length: 6,
    actionRequired: false,
    items: [
      {
        name: 'Prior to the painters leaving site the Supervisor & Project Manager are to check the completed works to ensure they have been completed to VDL’s expectation and the Dulux painting specification.',
        type: CheckItemType.note,
        complete: false,
      },
      {
        name: 'Tag out for touch ups post clean',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Contractor contacted',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Date arranged for work to be completed',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Work checked and accepted ready for handover',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Once all items are completed the painting products list to completed and stored onsite',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Dulux paint system guarantee completed and compiled with handover pack',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Once the painting has been checked & Accepted by the supervisor it is the Project Managers responsibility to remedy any issues. Any damage by subtrades should be recorded and completed as per VDL processes.',
        type: CheckItemType.note,
        complete: false,
      },
    ],
  },
  {
    id: 11,
    name: 'PM Landscaping Check',
    complete: false,
    completed: 0,
    length: 8,
    actionRequired: false,
    items: [
      {
        name: 'Gib credits returned-pallets, sheets, fixings',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Concrete pads confirmed',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Garage door operating smoothly',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Water and power connected to house',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Bricks removed',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Drainage complete if not already',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Confirm digger for driveway prep',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Call Client',
        type: CheckItemType.call,
        complete: false,
      },
    ],
  },
  {
    id: 12,
    name: 'Post Kitchen Install Inspection',
    complete: false,
    completed: 0,
    length: 4,
    actionRequired: false,
    items: [
      {
        name: 'Check feature walls',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Check tiled areas (font of r/s, kitchen etc)',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Check kitchen-bench top date, splashback order',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Call Client',
        type: CheckItemType.call,
        complete: false,
      },
    ],
  },
  {
    id: 13,
    name: 'Handover Inspection',
    complete: false,
    completed: 0,
    length: 10,
    actionRequired: false,
    items: [
      {
        name: 'Site clear of all building materials/rubbish',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Site levelled and seeded',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Interior has been cleaned',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Smoke alarms installed',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Vanities and laundry tub sealed',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'All paperwork/inspections complete',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Touch ups complete',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Remove skip and toilet',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Check water meter & cracked concrete paths or vehicle crossings',
        type: CheckItemType.item,
        complete: false,
      },
      {
        name: 'Call Client',
        type: CheckItemType.call,
        complete: false,
      },
    ],
  },
];
