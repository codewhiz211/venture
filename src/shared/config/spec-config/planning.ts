export const planningConfig = {
  id: 2,
  name: 'planning',
  title: 'Planning',
  canHide: false,
  fields: [
    { name: 'planningPmNote', display: 'PM Notes', type: 'textarea' },
    {
      name: 'planning',
      type: 'textarea',
      fullWidth: true,
      maxRows: 20,
      // prettier-ignore
      default: '* Full set of working drawings\n* Engineer designed foundation to meet NZS3604 regulations\n* Contract works Insurance - Total cost of the contract\n* Public Liability Insurance $1,000,000\n* 10 Year Standard Master Builders Guarantee\n* Council Permit Included\n* Professionally cleaned on completion\n      '
    }
  ]
};
