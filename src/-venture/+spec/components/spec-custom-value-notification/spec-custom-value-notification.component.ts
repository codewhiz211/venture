import { Component } from '@angular/core';
import { DrawerContent } from '@shell/drawer/drawer-content.type';
import { DrawerService } from '@shell/drawer/drawer.service';
import { NonStandardOptionsComponent } from '@shell/drawer/non-standard-options/non-standard-options.component';

@Component({
  selector: 'ven-spec-custom-value-notification',
  templateUrl: './spec-custom-value-notification.component.html',
  styleUrls: ['./spec-custom-value-notification.component.scss'],
})
export class SpecCustomValueNotificationComponent {
  constructor(private drawerService: DrawerService) {}

  public openDrawer() {
    this.drawerService.open(new DrawerContent(NonStandardOptionsComponent, null));
  }
}
