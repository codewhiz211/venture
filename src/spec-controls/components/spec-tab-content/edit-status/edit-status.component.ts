import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '../../../../shared/components/base.component';
import { DialogService } from '../../../../shell/dialogs/dialog.service';
import { SpecService } from '../../../../shared/services/spec/spec.service';

@Component({
  selector: 'app-edit-status',
  templateUrl: './edit-status.component.html',
  styleUrls: ['./edit-status.component.scss'],
})
export class EditStatusComponent extends BaseComponent implements OnInit {
  @Input() buildStatus;

  public status;
  private originalValue;

  options = ['Quote', 'Prepared for contract', 'Completed'];

  public submitAction = {
    label: 'SAVE',
    handler: () => this.onSubmit(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onClose(),
  };

  constructor(private dialogService: DialogService, private specService: SpecService) {
    super();
  }

  ngOnInit(): void {
    this.status = this.buildStatus.status;
    this.originalValue = this.buildStatus.status;
  }

  onSubmit() {
    if (this.status === this.originalValue) {
      this.onClose();
      return;
    }

    this.specService.updateStatusNew(this.buildStatus.specUid, this.status).subscribe(() => {
      this.onClose();
    });
  }

  onClose() {
    this.dialogService.closeActiveDialog();
  }
}
