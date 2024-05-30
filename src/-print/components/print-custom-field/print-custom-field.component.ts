import { Component, Input, OnInit } from '@angular/core';

import { LogicService } from '@services/spec/logic.service';
import { PrintCustomService } from './print-custom.service';
import { createFieldName } from '@shared/logic/createFieldName';

/* NOTE

This control is used to print custom blocks - when they were defined in the spec as a field with type 'custom-blocks'.
```
    {
      name: 'tiles-bathroom-additional',
      type: 'custom-blocks',
      title: 'Main Bathroom - Additional Tiles',
      default: { tileType: '' },
      blockFields: [
        { name: 'tileType', display: 'Tile Type', type: 'text', order: 0 },
        { name: 'tileColour', display: 'Tile Colour', type: 'text', order: 1 },
        { name: 'groutColour', display: 'Grout Colour', type: 'text', order: 2 },
        { name: 'tileLayout', display: 'Tile Layout', type: 'text', order: 3 },
        { name: 'info', display: 'Additional info', type: 'textarea', fullWidth: true, order: 4 }
      ]
    },
  */

@Component({
  selector: 'ven-print-custom-field',
  templateUrl: './print-custom-field.component.html',
  styleUrls: ['./print-custom-field.component.scss'],
})
export class PrintCustomFieldComponent implements OnInit {
  @Input() field; // type: 'custom-blocks',
  @Input() section; // name: tiles
  @Input() spec;

  pmNotesField: string;
  public blocks = [];
  public print: boolean = false;

  constructor(private printService: PrintCustomService, private logicService: LogicService) {}

  ngOnInit() {
    this.blocks = this.printService.getCustomBlocks(this.spec, this.field);
    this.print = this.printService.printCustomSection(this.spec, this.field);
    this.pmNotesField = `${createFieldName(this.field.name)}PmNote`;
  }

  public findFieldError(block, blockField) {
    const lookUp = this.spec[this.field.name][block];

    if (lookUp) {
      return lookUp[`${blockField}_error`];
    } else {
      return null; // TODO (sc4030): review this does this break anything???
    }
  }

  public highlightNote(field) {
    return (
      this.spec &&
      this.spec['highlighted_notes'] &&
      this.spec['highlighted_notes'][this.section.name] &&
      this.spec['highlighted_notes'][this.section.name][field]
    );
  }
}
