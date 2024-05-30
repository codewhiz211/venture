import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { DialogService } from '@shell/dialogs/dialog.service';
import { Location } from '@angular/common';
import { SpecService } from '@services/spec/spec.service';
import { SpecTrackChangesComponent } from '@shell/drawer/spec-track-changes/spec-track-changes.component';
import { TrackingService } from '@services/spec/tracking.service';
import { WindowService } from '@services/window.service';

export interface AppChromeDetailsPageHeaderActionConfig {
  action: () => void;
  icon: string;
  label: string;
}

export interface AppChromeDetailsPageHeaderConfig {
  barActions: AppChromeDetailsPageHeaderActionConfig[];
  menuActions: AppChromeDetailsPageHeaderActionConfig[];
  title: string;
}

@Component({
  selector: 'ven-app-chrome-details-page-header',
  templateUrl: './app-chrome-details-page-header.component.html',
  styleUrls: ['./app-chrome-details-page-header.component.scss'],
})
export class AppChromeDetailsPageHeaderComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() config: AppChromeDetailsPageHeaderConfig;
  @Output() onClose = new EventEmitter();

  public content: any = null;
  public title: string;
  public barActions;
  public menuActions;
  public headerColour = this.windowService.isDesktop ? 'white' : 'black';

  constructor(
    private location: Location,
    private windowService: WindowService,
    private trackingService: TrackingService,
    private dialogService: DialogService,
    private specService: SpecService
  ) {}

  @ViewChild('titleRef') titleRef: ElementRef;
  @ViewChild('lhsRef') lhsRef: ElementRef;

  ngAfterViewInit() {
    const containerWidth = this.lhsRef.nativeElement.offsetWidth;
    const textWidth = this.titleRef.nativeElement.offsetWidth;

    if (textWidth > containerWidth) {
      // we add/remove a class to the body in order to update the style of both this component AND AppChromeDetailsPageComponent
      this.windowService.addBodyClass('tall-header');
    } else {
      this.windowService.removeBodyClass('tall-header');
    }
  }

  ngOnChanges() {
    this.title = this.config.title;
    this.barActions = this.config.barActions;
    this.menuActions = this.config.menuActions;
  }

  ngOnDestroy() {
    this.windowService.removeBodyClass('tall-header');
  }

  onCloseClick() {
    if (this.trackingService.trackChangesEnabled) {
      this.warnUserAboutLosingTrackedChanges();
    } else {
      this.location.back();
      this.onClose.emit('close');
    }
  }

  private warnUserAboutLosingTrackedChanges() {
    this.trackingService
      .showAlertDialog()
      .afterClosed()
      .subscribe((res: string) => {
        switch (res) {
          case 'exit':
            this.location.back();
            this.trackingService.disableTracking();
            this.onClose.emit('close');
            break;
          case 'view':
            this.dialogService.open(SpecTrackChangesComponent, {
              data: {
                spec: this.specService.getActiveSpec(),
              },
              dialogTitle: 'Tracked Changes',
            });
            break;
          case 'resume':
          default:
            break;
        }
      });
  }
}
