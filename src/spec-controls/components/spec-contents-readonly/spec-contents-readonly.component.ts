import { Component, Input } from '@angular/core';

import { ClientSpec } from '@interfaces/client-spec.interface';
import { SectionConfig } from 'src/-venture/+spec/components/section-config.interface';
import { SpecActiveService } from '@services/spec/spec.active.service';

// This can probably replace the contents in spec.

@Component({
  selector: 'ven-spec-contents-readonly',
  templateUrl: './spec-contents-readonly.component.html',
  styleUrls: ['./spec-contents-readonly.component.scss'],
})
export class SpecContentsReadOnlyComponent {
  @Input() spec: ClientSpec;
  @Input() sections: SectionConfig[] = [];

  constructor(private activeSpecService: SpecActiveService) {}

  onSectionClicked(sectionId) {
    // here we need to open the clicked section and collapse the others
    this.activeSpecService.openSection(sectionId);
  }

  onSectionActionClicked(actionId) {
    this.activeSpecService.openSectionAction(actionId);
  }
}
