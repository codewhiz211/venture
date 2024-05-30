import { Component, ComponentFactoryResolver, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { IDialogConfig } from '../base-dialog-data';
import { DrawerContentDirective } from '../../drawer/drawer-content.directive';
import { AppChromeBottomSheetConfig } from '../../app-chrome-bottom-sheet/app-chrome-bottom-sheet.component';

@Component({
  selector: 'ven-bottom-sheet',
  templateUrl: './base-bottom-sheet.component.html',
  styleUrls: ['./base-bottom-sheet.component.scss'],
})
export class BaseBottomSheetComponent implements OnInit {
  @ViewChild(DrawerContentDirective, { static: true }) drawerHost: DrawerContentDirective;

  public config: AppChromeBottomSheetConfig;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: IDialogConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
    private bottomSheetRef: MatBottomSheetRef<BaseBottomSheetComponent>
  ) {}

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.data.dialogComponent);
    const viewContainerRef = this.drawerHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);

    // TODO theAppChromeBottomSheet config needs populating AppChromeBottomSheetConfig
    this.config = {
      title: this.data?.dialogTitle,
      close: (e) => this.close(e),
    };

    if (this.data.dialogData) {
      const dataKey = this.data.dataKey || 'data';
      //@ts-ignore
      componentRef.instance[dataKey] = this.data.dialogData;
    }
  }

  close(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
