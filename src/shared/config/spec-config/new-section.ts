import { SectionType } from './section-type';

export interface IField {
  name: string;
  display: string;
  type: string;
  items?: any[];
  maxRows?: any;
  minRows?: any;
}

export interface INewSectionConfig {
  id: number;
  name: string;
  title: string;
  canHide: boolean;
  hasExtras: boolean;
  fields: IField[];
  type: SectionType;
}

class NewSection implements INewSectionConfig {
  constructor(
    public id: number,
    public name: string,
    public title: string,
    public canHide: boolean,
    public hasExtras: boolean,
    public fields: IField[],
    public type: SectionType
  ) {}
}

export { NewSection };
