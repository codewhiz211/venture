const pricingTableSections = ['Labour', 'Materials', 'Quotes'];

const commonDialogFields = [
  { name: 'qty', type: 'number' },
  { name: 'unit', type: 'text' },
  { name: 'value', type: 'number', prefix: '$' },
  { name: 'margin', type: 'number', suffix: '%', defaultValue: '17.5' },
];

const pricingDialogFields = [
  { name: 'description', type: 'option', options: ['QS', 'PM', 'Travel', 'H&S', 'Plans'] },
  ...commonDialogFields,
];

const sectionPricingDialogFields = [
  { name: 'section', type: 'option', options: pricingTableSections },
  { name: 'description', type: 'text' },
  ...commonDialogFields,
];

const pricingColumns = [
  { accessor: 'description', label: '', class: ' dark-medium-emphasis' },
  { accessor: 'qty', label: 'Qty', type: 'number', class: 'pull-right dark-medium-emphasis' },
  { accessor: 'unit', label: 'Unit', class: 'pull-right dark-medium-emphasis' },
  {
    accessor: 'value',
    label: 'Value',
    type: 'number',
    prefix: '$',
    class: 'pull-right dark-medium-emphasis',
  },
  {
    accessor: 'margin',
    label: 'Margin',
    type: 'number',
    suffix: '%',
    class: 'pull-right dark-medium-emphasis',
  },
  {
    accessor: 'total',
    label: 'Total',
    type: 'number',
    prefix: '$',
    class: 'pull-right dark-medium-emphasis',
  },
  {
    accessor: 'actions',
    label: '',
    type: 'operator',
    icon: 'more_vert',
    children: [
      { name: 'Edit', icon: 'edit' },
      { name: 'Delete', icon: 'delete' },
    ],
    class: 'pull-right',
  },
];

export const pricingSectionConfig = [
  {
    id: 'requestDetails',
    title: 'Request details',
    fields: [
      { name: 'section', display: 'spec section', type: 'text', class: 'half-width' },
      { name: 'field', display: 'spec option', type: 'text', class: 'half-width' },
      { name: 'value', display: 'new value', type: 'text', hide: { field: 'field', value: 'N/A' }, class: 'half-width' },
      { name: 'userName', display: 'requested by', secondField: 'userEmail', type: 'text', class: 'half-width' },
      { name: 'details', display: 'option details', type: 'text', class: 'full-width' },
      { name: 'attachment', type: 'attachment', class: 'full-width' },
    ],
  },
  {
    id: 'description',
    title: 'Description',
    fields: [{ name: 'description', display: 'Option description', type: 'texearea', class: 'full-width' }],
  },
  {
    id: 'png',
    title: 'P & G',
    table: {
      columns: pricingColumns,
      dialogFields: pricingDialogFields,
    },
  },
  {
    id: 'extras',
    title: 'Extras',
    table: {
      columns: pricingColumns,
      dialogFields: sectionPricingDialogFields,
      tableSections: pricingTableSections,
    },
  },
  {
    id: 'credits',
    title: 'Credits',
    table: {
      columns: pricingColumns,
      dialogFields: sectionPricingDialogFields,
      tableSections: pricingTableSections,
    },
  },
  {
    id: 'notes',
    title: 'Notes',
    fields: [
      { name: 'notes', display: 'Pricing notes', type: 'texearea', class: 'full-width' },
      { name: 'note-library', display: 'NOTE LIBRARY', type: 'button', target: 'notes', class: 'pull-right' },
    ],
  },
  {
    id: 'summary',
    title: 'Summary',
  },
];
