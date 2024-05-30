import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { AuditService } from '@services/spec/audit.service';
import { ClientSpec } from '@interfaces/client-spec.interface';
import { SpecService } from '@services/spec/spec.service';

@Component({
  selector: 'ven-spec-custom-manager',
  templateUrl: './spec-custom-manager.component.html',
  styleUrls: ['./spec-custom-manager.component.scss'],
})
export class SpecCustomManagerComponent implements OnInit, OnChanges {
  // this defines how to build the custom blocks section
  @Input() field: any;
  // the current spec
  @Input() spec: ClientSpec;
  @Input() section;

  public addingBlock = false;
  public blocks: any[] = [];
  public subTitle;
  public sectionHidden = false;

  constructor(private cd: ChangeDetectorRef, private auditService: AuditService, private specService: SpecService) {}

  ngOnInit() {
    this.getSubtitle(this.spec);
    const existingBlocks = this.spec[this.field.name];
    // load what is in spec (initial spec will start with one, but user could remove all)
    if (existingBlocks) {
      // if an array
      if (existingBlocks.slice) {
        existingBlocks.forEach(() => {
          this.addBlock();
        });
      } else {
        this.addNewBlock();
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['spec']) {
      this.getSubtitle(changes['spec'].currentValue);
      this.sectionHidden = this.getIsSectionHidden(changes['spec'].currentValue, this.section.name);
    }
  }

  getIsSectionHidden(spec, sectionName) {
    const hiddenSections = spec.hiddenSections;
    const fieldName = this.getBlockName(this.section.name);

    //blocks[0].fields[0]?.canHide
    if (!hiddenSections[sectionName] || hiddenSections[sectionName] === {}) {
      return false;
    }
    if (hiddenSections[sectionName][fieldName]) {
      return true;
    }
    return false;
  }

  getBlockName(sectionName) {
    switch (sectionName) {
      case 'floor':
        return 'flooring-additional';

      case 'cladding':
        return 'cladding-additional';
    }
  }
  getSubtitle(spec) {
    // if the user has edited the field title (subtitle) we use that
    // else we default (in the template) to the configured field title
    const custom_fields = spec['custom_fields'];
    if (custom_fields && custom_fields[this.section.name]) {
      this.subTitle = custom_fields[this.section.name][this.field.name];
    }
  }

  showSection() {
    const fieldName = this.getBlockName(this.section.name);
    this.specService.showSubSection(this.spec.uid, this.section.name, fieldName).subscribe();
  }

  addBlock() {
    // this adds a block of fields to the section.
    // the data will not be saved until the field saves
    const section = { name: `${this.field.name}^${this.blocks.length}` };

    this.blocks.push({ id: this.blocks.length, section, fields: this.field.blockFields });
  }

  addNewBlock() {
    this.addingBlock = true;
    this.specService.addCustomBlock(this.spec.uid, this.field.name, this.blocks.length, this.field.default).subscribe();
    this.auditService.addCustomBlock(this.spec.uid, this.field.name, this.blocks.length, this.field.default);
    setTimeout(() => {
      this.addingBlock = false;
      // use a small delay to makes sure that the new blocks exist before we try and reference them
      // (when the added fields check any conditional field logic)
      const section = { name: `${this.field.name}^${this.blocks.length}` };
      this.blocks.push({ id: this.blocks.length, section, fields: this.field.blockFields });
      this.cd.markForCheck();
    }, 1000);
  }

  removeBlock(id) {
    // when removing a block we need to remove from server any fields/extras set for this block
    // we also need to update the idx used for the id/section name to ensure we don't try to
    // reference a block that no longer exists (essentially, reindex the array)
    this.blocks = this.blocks
      .filter((b) => b.id !== id)
      .map((block, idx) => {
        block.id = idx;
        block.section = { name: `${this.field.name}^${idx}` };
        return block;
      });
    this.specService.removeCustomBlock(this.spec.uid, this.field.name, id).subscribe();
    this.auditService.removeCustomBlock(this.spec.uid, this.field.name, id);
  }
}
