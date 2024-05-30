import { Component, Input, OnChanges } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';
import COLOURS from '@styles/colours';
import { UserType } from '@auth/roles';
import { WindowService } from '@services/window.service';

export interface AppChromeDetailsPageFooterActionConfig {
  action?: () => void;
  icon: string;
  label: () => string;
  primary?: boolean;
  hide?: boolean;
  data?: object;
  tabs: string[];
  shownOnDesktop?: boolean;
}

export interface AppChromeDetailsPageFooterConfig {
  actions: AppChromeDetailsPageFooterActionConfig[];
  type:
    | 'forceSpeedDial' //force all buttons should be shown in speed dial, , no matter what number or what device
    | 'forceFab' //force all buttons should be fab, no matter what number or what device
    | 'mix'; // speed dial for multiple while fab for single
}

@Component({
  selector: 'ven-app-chrome-details-page-footer',
  templateUrl: './app-chrome-details-page-footer.component.html',
  styleUrls: ['./app-chrome-details-page-footer.component.scss'],
})

/**
 * footer button scenarios:
 *   job-details(fab) page on Subbie App;
 *   pricing-details(mix) on Staff App.
 *   build-details(speed dial) on Staff App.
 */
export class AppChromeDetailsPageFooterComponent implements OnChanges {
  @Input() config: AppChromeDetailsPageFooterConfig;
  @Input() currentTab;

  public actions = [];
  private isDesktop;

  constructor(private windowService: WindowService) {
    this.isDesktop = this.windowService.isDesktop;
  }

  ngOnChanges(): void {
    if (this.config.actions) {
      this.actions = this.config.actions
        .filter((action) => {
          return (
            action.tabs.includes(this.currentTab) &&
            !action.hide &&
            (this.config.type != 'forceSpeedDial' && this.isDesktop ? action.shownOnDesktop : true)
          );
        })
        .map((action) => ({
          ...action,
          colour: action.primary ? COLOURS.white : COLOURS.bluePrimary,
        }));
    }
  }
}
