import { Component, Input } from '@angular/core';

import { ClientSpec } from '@interfaces/client-spec.interface';
import { SpecActiveService } from '@services/spec/spec.active.service';

@Component({
  selector: 'ven-spec-contents',
  templateUrl: './spec-contents.component.html',
  styleUrls: ['./spec-contents.component.scss'],
})
export class SpecContentsComponent {
  @Input() sections: any[] = [];
  @Input() spec: ClientSpec;

  constructor(private activeSpecService: SpecActiveService) {}

  onSectionClicked(sectionId) {
    // here we need to open the clicked section and collapse the others
    this.activeSpecService.openSection(sectionId);
  }

  onSectionActionClicked(actionId) {
    this.activeSpecService.openSectionAction(actionId);
  }
}
