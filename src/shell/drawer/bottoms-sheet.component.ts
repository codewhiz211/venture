import { Component, ComponentFactoryResolver, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { DrawerContentDirective } from './drawer-content.directive';
import { IDrawerContentComponent } from './drawer-content.interfaces';

@Component({
  selector: 'ven-bottom-sheet',
  template: `
    <ng-template venDrawerContent></ng-template>
  `
})
export class BottomSheetComponent implements OnInit {
  @ViewChild(DrawerContentDirective, { static: true }) drawerHost: DrawerContentDirective;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public content: any,
    private componentFactoryResolver: ComponentFactoryResolver,
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>
  ) {}

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.content.component);
    const viewContainerRef = this.drawerHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as IDrawerContentComponent).data = this.content.data;
  }

  close(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
