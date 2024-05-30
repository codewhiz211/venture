import { Component, Input, OnInit } from '@angular/core';

import { ClientSpec } from '@interfaces/client-spec.interface';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '@shell/drawer/drawer.service';
import { EVENT_TYPES } from '@shell/drawer/drawer-content.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrackInterface } from '@interfaces/track.interface';
import { TrackingService } from '@services/spec/tracking.service';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-spec-track-changes',
  templateUrl: './spec-track-changes.component.html',
  styleUrls: ['./spec-track-changes.component.scss'],
})
export class SpecTrackChangesComponent implements OnInit {
  @Input() data: any;

  spec: ClientSpec;
  trackData: TrackInterface[];
  trackingStartedAt: Date;

  constructor(
    private drawerService: DrawerService,
    private dialogService: DialogService,
    private trackingService: TrackingService,
    private windowService: WindowService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.spec = { ...this.data.spec };
    this.trackData = this.trackingService.getCurrentChanges;
    this.trackingStartedAt = this.trackingService.getTrackingStartedTime;
  }

  exitTracking() {
    this.trackingService.disableTracking();
    this.drawerService.raiseEvent(EVENT_TYPES.exitTracking, this.data.selectedTab ? this.data.selectedTab : undefined);
    this.drawerService.close();
    this.dialogService.closeActiveDialog();
  }

  resumeTrack() {
    this.drawerService.raiseEvent(EVENT_TYPES.resumeTracking);
    this.drawerService.close();
    this.dialogService.closeActiveDialog();
  }

  copyToClipboard() {
    if (this.trackData) {
      let data = '';

      this.trackData.forEach((item: TrackInterface) => {
        data = item.field ? `${data}${item.section} - ${item.field}:    ${item.value} \n` : `${data}${item.section}:    ${item.value} \n`;
      });

      this.windowService.copyToClipboard(data);

      this.snackBar.open('Added to clipboard', undefined, {
        duration: 2000,
      });
    }
  }
}
