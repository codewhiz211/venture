// any property that needs to be editable from the spec
// should be under the details node
export interface ClientSpec {
  uid: string;
  lastModified: Date;
  contact_details: {
    client: string;
    emails: string;
    phones: string;
    consultantName: string;
    consultantPhone: string;
    consultantEmail: string;
    projectManagerName: string;
    projectManagerPhone: string;
    projectManagerEmail: string;
  };
  section_details: any;
  quote: any;
  subbies: any;
  details: {
    lot: string;
    client: string;
    subdivision: string;
    email: string;
    phone: string;
    lastModified: any; // remove?
    specVersion: number;
    postContract: boolean;
    status: string;
    synced: boolean;
  };
  signatures: any;
  suggestions: string[];
  sort?: {
    orderList: string[];
  };
  hiddenSections: boolean[];
  disabled: boolean;
  highlighted_notes: any;
  custom_sections?: object;
  custom_value?: any[];
}
