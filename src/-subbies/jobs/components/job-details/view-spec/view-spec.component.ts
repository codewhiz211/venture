import { Component, Input, OnInit } from '@angular/core';

import { AppChromeBottomSheetConfig } from '@shell/app-chrome-bottom-sheet/app-chrome-bottom-sheet.component';
import { DrawerService } from '@shell/drawer/drawer.service';
import { IDrawerContentComponent } from '@shell/drawer/drawer-content.interfaces';

@Component({
  selector: 'ven-view-spec',
  templateUrl: './view-spec.component.html',
  styleUrls: ['./view-spec.component.scss'],
})
export class ViewSpecComponent implements IDrawerContentComponent, OnInit {
  @Input() data: any;

  public config: AppChromeBottomSheetConfig;

  constructor(private drawerService: DrawerService) {}

  ngOnInit(): void {
    this.config = {
      title: 'View Spec',
      close: () => this.drawerService.close(),
    };
  }
}
