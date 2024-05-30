import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';

import { NonStandardOptionComponent } from 'src/spec-controls/components/spec-tab-content/non-standard-option/non-standard-option.component';

@Component({
  selector: 'ven-staff-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  @Input() customValues;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  onNonStandardOptions() {
    this.dialogService.open(NonStandardOptionComponent, {
      dialogTitle: 'Non-Standard Options',
      size: DialogSize.Large,
      options: { autoFocus: false }, // to avoid the focus to button and scroll down when dialog opened
      data: {
        customValues: this.customValues,
      },
    });
  }

  onElectricalReview() {
    alert('Coming soon.');
  }

  onQuoteReview() {
    alert('Coming soon.');
  }
}
