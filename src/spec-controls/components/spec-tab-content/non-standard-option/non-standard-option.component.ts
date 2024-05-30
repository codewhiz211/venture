import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '@shared/components/base.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { SpecService } from '@services/spec/spec.service';

@Component({
  selector: 'app-non-standard-option',
  templateUrl: './non-standard-option.component.html',
  styleUrls: ['./non-standard-option.component.scss'],
})
// This component is on new shell
export class NonStandardOptionComponent extends BaseComponent implements OnInit {
  @Input() data;
  public undismissedCustomOptions;
  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onClose(),
  };

  constructor(private dialogService: DialogService, private specService: SpecService) {
    super();
  }

  ngOnInit(): void {
    this.undismissedCustomOptions = this.data.customValues;
  }

  dismissCustomValue(item) {
    this.specService
      .dismissCustomValue(item.sectionKey, item.fieldKey)
      .pipe(this.takeUntilDestroy())
      .subscribe(() => {
        this.undismissedCustomOptions = this.undismissedCustomOptions.filter(
          (v) => !(v.sectionKey === item.sectionKey && v.fieldKey === item.fieldKey)
        );
      });
  }

  onClose() {
    this.dialogService.closeActiveDialog();
  }
}
