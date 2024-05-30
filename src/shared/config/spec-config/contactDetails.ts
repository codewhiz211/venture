import { CONSULTANTS } from './consultants';
import { PROJECT_MANAGERS } from './projectMangers';
import { QUANTITY_SURVEYORS } from './quantitySurveyors';

export const contactDetailsConfig = {
  id: 0,
  name: 'contact_details',
  title: 'Contact Details',
  canHide: false,
  fields: [
    { name: 'client', display: 'Client Name', type: 'text', fullWidth: true },
    { name: 'phones', display: 'Phone', type: 'multi-text', validation: 'phone', textType: 'number' },
    { name: 'emails', display: 'Email', type: 'multi-text', validation: 'email', textType: 'email' },
    { name: 'consultantName', display: 'Sales Consultant', type: 'dropdown', items: CONSULTANTS.map((c) => c.name) },
    {
      name: 'consultantPhone',
      display: 'Sales Consultant Phone',
      type: 'text',
      items: CONSULTANTS.map((c) => c.phone),
      validation: 'phone',
    },
    {
      name: 'consultantEmail',
      display: 'Sales Consultant Email',
      type: 'text',
      textType: 'email',
      items: CONSULTANTS.map((c) => c.email),
      fullWidth: true,
    },
    { name: 'projectManagerName', display: 'Project Manager', type: 'dropdown', items: PROJECT_MANAGERS.map((c) => c.name) },
    {
      name: 'projectManagerPhone',
      display: 'Project Manager Phone',
      type: 'text',
      items: PROJECT_MANAGERS.map((c) => c.phone),
      validation: 'phone',
    },
    {
      name: 'projectManagerEmail',
      display: 'Project Manager Email',
      type: 'text',
      textType: 'email',
      items: PROJECT_MANAGERS.map((c) => c.email),
      fullWidth: true,
    },
    {
      name: 'quantitySurveyorName',
      display: 'Quantity Surveyor',
      type: 'dropdown',
      items: QUANTITY_SURVEYORS.map((c) => c.name),
    },
    {
      name: 'quantitySurveyorEmail',
      display: 'Quantity Surveyor Email',
      type: 'text',
      textType: 'email',
      items: QUANTITY_SURVEYORS.map((c) => c.email),
      fullWidth: true,
    },
  ],
  expandLastField: true,
};
