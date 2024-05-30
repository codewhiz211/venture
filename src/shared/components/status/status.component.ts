import { Component, Input, OnInit } from '@angular/core';

import { DialogService } from '@shell/dialogs/dialog.service';
import { EditStatusComponent } from 'src/spec-controls/components/spec-tab-content/edit-status/edit-status.component';

@Component({
  selector: 'ven-staff-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit {
  @Input() specUid;
  @Input() status;
  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  onEditStatus() {
    this.dialogService.open(EditStatusComponent, {
      data: { specUid: this.specUid, status: this.status },
      dataKey: 'buildStatus', //@Input() keyname of the EditStatusComponent
      dialogTitle: 'Build Status',
    });
  }
}
