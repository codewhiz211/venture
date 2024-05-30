import { BehaviorSubject, Subject } from 'rxjs';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { ANIMATION_TIME } from '@shell/animations/constants';
import { AppChromeDetailsPageFooterConfig } from '../app-chrome-details-page-footer/app-chrome-details-page-footer.component';
import { AppChromeDetailsPageHeaderConfig } from '../app-chrome-details-page-header/app-chrome-details-page-header.component';
import { TabConfig } from '../app-chrome-details-content/tab-config.interface';
import { TrackingService } from '@services/spec/tracking.service';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-application-chrome-details-page',
  templateUrl: './app-chrome-details-page.component.html',
  styleUrls: ['./app-chrome-details-page.component.scss'],
})
export class AppChromeDetailsPageComponent implements OnChanges {
  @Input() headerConfig: AppChromeDetailsPageHeaderConfig;
  @Input() footerConfig: AppChromeDetailsPageFooterConfig;
  @Input() contentConfig: TabConfig[];
  @Output() tabChanged = new EventEmitter();
  //for hide fab/speed dial when switching tab
  public showFooter$ = new BehaviorSubject(true);

  //To connect footer buttons' behaviours go with tabs in content, and change tab from content
  @Input() currentTab;

  constructor(private windowService: WindowService) {
    this.windowService.addBodyClass('details-open');
  }

  ngOnChanges() {
    //only to init currentTab
    if (!this.contentConfig || this.currentTab) {
      return;
    }
    this.currentTab = this.contentConfig[0].id;
  }

  onClose() {
    //wait after slide-out animation end (for safari fix)
    setTimeout(() => {
      this.windowService.removeBodyClass('details-open');
    }, ANIMATION_TIME);
  }

  handleTabChanged(tab) {
    this.showFooter$.next(false);
    this.currentTab = tab;
    this.tabChanged.emit(tab);
  }
}
