export interface FieldConfig {
  // name of the field
  name: string;
  // label (displayed to user)
  display: string;
  // what kind of form field (text/dropdown/textarea)
  type: string;
  // for text fields, what type of validation
  // - text, email, phone
  validation?: string;
  // if set, th contents will be used as suffix for the field
  suffix?: string;
  // some fields are dropdowns, these are their items
  items?: any[];
  //some deprecated items which can only be shown but not to be selected
  historyItems?: any[];
  // if st add a hint to the field
  hint?;
  // this object defines an item to be added to extras area if a dropdown item is selected
  extras?;
  // if set a default value to use for the field
  default?;
  // if set, a field value is required (defaults to false,optional)
  required?;
  // if set, make this field full width (100%)
  fullWidth?;
  // trigger condition for dropdown-conditional control
  condition?;
  // the name of the linked conditional field(s) using this field as a trigger
  conditional?;
  // this field has custom error messages
  errors?;
  // the field to which any error should be applied
  errorField?;
  // max numbe of rows for a text area config
  maxRows?;
  // min number of rows for a text area config
  minRows?;
  // some fields define static text
  text?;
  // text for button that adds optional text field
  btnText?;
  // hide sub-section
  canHide?: string;
  // highlight hint
  warning?: boolean;
  // update related fields hint
  updateHints?;
  // if set, defines default values for one or more OTHER fields within the SAME section
  // autofill?; this is now handled in spec.service getPrefillChanges
  hideWhenConditional?;
}

// TODO split config and use inheritance / extends?

export interface DropdownItem {
  display: string;
  value: string;
}
