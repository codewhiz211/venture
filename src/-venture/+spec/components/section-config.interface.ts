import { FieldConfig } from './field-config.interface';

export interface SectionConfig {
    // unique id for section (and display order)
    id: number;
    // name for the section. THis will be used if we need to prefix a value (E.g additional)
    name: string;
    // label (displayed to user)
    title: string;
    // if set - array of fields to display in form
    fields?: FieldConfig[];
    // if set - array of text to display in a list
    list?: string[];
    // if set then this section can have extras added
    hasExtras?;
    // if true the last field is made full width
    expandLastField?;
    // if set this section has custom blocks
    hasCustom?;
    // config for  custom blocks
    custom?;
    // (WIP)
    optionalExtras?;
    // (WIP)
    component?;
  }
