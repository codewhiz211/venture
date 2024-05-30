import { mockSections } from './mock-data';
import { of } from 'rxjs';

export const auditServiceStub = { addChangesToAuditNew: () => {} };
export const clientServiceStub = {
  getActiveClient: () => {},
  getClients: () => {},
  clients$: of(),
  getClientInfo: () => of({ lot: 'testLot' }),
};
export const httpClientStub = {
  list: () => {},
  get: () => {
    return of();
  },
  post: () => {
    return of();
  },
  delete: () => {
    return of();
  },
  put: () => {
    return of();
  },
};

export const localStorageStub = { save: () => {}, get: () => {}, remove: () => Promise.resolve() };
export const loggerServiceStub = { debug: () => {}, error: () => {}, log: () => {} };
export const windowServiceStub = {
  isMobile: false,
  isDesktop: true,
  isSafari: () => {},
  addBodyClass: (data) => {},
  removeBodyClass: (data) => {},
  windowRef: { open: () => {} },
};

export const specActiveServiceStub = {
  getActiveSpec: () => {},
  initialiseActiveSpec: () => {},
  updateActiveSpec: () => {},
  updateSpec: () => {},
  activeSpec$: of(),
};
export const specDbServiceStub = { getClientSpec: () => {} };
export const specFormatterServiceStub = {
  getUpdateSpecChanges: () => {},
  combineUserAndDefinedSections: () => {
    return mockSections;
  },
};

export const specUtilityServiceStub = { addSlash: () => {}, removeSlash: () => {} };
export const suggestionServiceStub = { getSuggestions: () => {} };

export const matSnackBarStub = { open: () => {} };

export const matDialogStub = { open: () => {} };

export const jobServiceStub = {
  jobs$: of(),
  scheduledJobs$: of(),
  activeDate$: of(),
  getScheduleDates: () => {
    return of();
  },
  loadAllJobsUnderSubbie: () => {
    return of();
  },
  loadScheduleByMonth: () => {
    return of();
  },
  getOutstandingRemedialJobs: () => {
    return of();
  },
  getActivityInfo: () => {
    return of();
  },
};

export const subbieServiceStub = {
  subbieJobs$: of(),
  loadSubbies: () => {
    return of();
  },
  getSubbieUid: () => {
    return of();
  },
  getSubbieList: () => {
    return of();
  },
  getSubbieJobs: () => {},
};

export const headerMenuServiceStub = { addMenuItem: () => {} };

export const drawerServiceStub = { open: () => {}, close: () => {} };

export const dialogServiceStub = { open: () => {}, closeActiveDialog: () => {} };

export const folderServiceStub = { currentFolder: of(), folders: of(), addFolder: () => {}, getCurrentFolder: 'current folder' };

export const routerStub = { navigate: (route) => {} };

export const preferenceServiceStub = { savedSpecs$: of(), handleSavedItemToggle: () => {}, savedSpecs: undefined, savedPricing$: of() };

export const appbarMenuServiceStub = { removeMenuItem: () => {} };

export const activedRouterStub = { snapshot: { paramMap: { get: () => {} } } };

export const specServiceStub = {
  getClientSpecAndSuggestions: () => {},
  editSpecMode: () => {},
  addSectionsFromSpec: () => {},
  updateStatusNew: () => {},
  dismissCustomValue: () => {
    return of();
  },
};

export const adminServiceStub = {
  deleteClient: () => of(),
  getAllSubbies: () => {},
  getStaff: () => {},
  editSubbie: () => of(),
  createSubbie: () => of(),
  staff$: of(),
  subbie$: of(),
};

export const formBuilderStub = {
  group: () => {
    return {
      patchValue: () => {},
      get: () => {
        return { controls: [] };
      },
    };
  },
  array: () => [],
};

export const pricingServiceStub = {
  pricingItemUnderSpec$: of(),
  getPricingOption: () => of(),
  optionSummary$: of([
    {
      uid: '-MqLjcFN8DeoauMkJU3q',
      credits: {
        adminFee: 0.02,
        items: {
          Labour: [
            {
              description: 'extending layout',
              id: 0,
              margin: '17.5',
              qty: 1,
              section: 'Labour',
              total: 150.4,
              unit: 'hr',
              value: 128,
            },
          ],
          Materials: [
            {
              description: 'QS',
              id: 0,
              margin: '17.5',
              qty: 4,
              section: 'Materials',
              total: 237.35000000000002,
              unit: 'hr',
              value: 50.5,
            },
          ],
        },
      },
      description: 'test',
      details: 'Upgrade Window Colour to Violet',
      extras: {
        adminFee: 0.05,
        items: {
          Labour: [
            {
              description: 'Floor placing',
              id: 0,
              margin: '17.5',
              qty: 10,
              section: 'Labour',
              total: 705,
              unit: 'hr',
              value: 60,
            },
            {
              description: 'light installing',
              id: 1,
              margin: '17.5',
              qty: 5,
              section: 'Labour',
              total: 587.5,
              unit: 'hr',
              value: 100,
            },
          ],
          Materials: [
            {
              description: 'floor tiles',
              id: 0,
              margin: '17.5',
              qty: 120,
              section: 'Materials',
              total: 3525,
              unit: 'piece',
              value: 25,
            },
          ],
        },
      },
      field: 'windowColour',
      notes:
        'No allowance to paint or stain fencing &/or gates and the like.\nNo allowance for engineering documentation, fees & the like.\n\nNo allowance to paint or stain fencing &/or gates and the like.\nNo allowance for engineering documentation, fees & the like.\nNo Allowance for Building Consent Amendments, Fees, Documentation & the like if required.',
      png: {
        adminFee: 0.1,
        items: [
          {
            description: 'QS',
            id: 0,
            margin: '17.5',
            qty: 0.5,
            total: 35.25,
            unit: 'hr',
            value: 60,
          },
          {
            description: 'PM',
            id: 1,
            margin: '17.5',
            qty: 1,
            total: 82.25,
            unit: 'hr',
            value: 70,
          },
        ],
      },
      requestDate: 1638911606953,
      status: 'Draft',
      user: {
        email: 'junny185@126.com',
        name: 'Jenny Yan',
      },
      userEmail: 'junny185@126.com',
      userName: 'Jenny Yan',
      value: 'Voilet',
    },
  ]),
  requestPricing: () => of(),
  getAllPricingItem: () => {},
  getPricingItemUnderSpec: () => {},
  updatePricing: () => {},
};

export const trackingServiceStub = {
  trackChangesEnabled: true,
  enableTracking: () => {},
  openTrackChangesSnackBar: () => {},
};

export const sentryServiceStub = { logError: () => {} };

export const noteServiceStub = {
  notes: [],
  notes$: of(),
  add: () => {},
  delete: () => {},
  edit: () => {},
  getNotes: () => {},
};

export const shareServiceStub = {
  getShareUrl: () => {},
};
