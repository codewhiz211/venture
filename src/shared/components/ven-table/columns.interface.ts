export interface Column {
  accessor: string;
  label: string;
  width: string; // column width on desktop, end with '%'
  mobileWidth: string; // column width on mobile and tablet, end with '%', if set as '0%', the column will be hiden on mobile and tablet
  format?: 'shortDate' | 'chip'; // pipes or decorations that using for cell, example: pricing-page
  type?: 'operator' | 'number';
  icon?: string; //icon name in ven-icon-new component, only after 'operator' type
  children?: OperatorChildren[]; // multiple operators under a menu should be after 'operator' type, example: note-table
  complex?: 'multi-elements'; //For multi-elements, values under this cell will be wrapped by `chip` automatically, example: staff-management-tab.
  adapter?: object; // adapter to convert to displaying value from DB value, example: staff-management-tab.
  fieldName?: string; //field under object[accessor], example: subbies-management-tab.
  conditionalWrap?: {
    //example: builds-page
    value: string;
    wrap: 'chip';
  };
  class?: string; //class to add on the cells under this columns, apart from this, we can using :host::ng-deep.[class] to add extra styles for the cell, example: note-library
}

interface OperatorChildren {
  name: string;
  icon: string;
}
