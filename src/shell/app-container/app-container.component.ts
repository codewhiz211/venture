import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { BottomSheetComponent } from '../drawer/bottoms-sheet.component';
import { DrawerContentDirective } from '../drawer/drawer-content.directive';
import { DrawerService } from '../drawer/drawer.service';
import { IDrawerContentComponent } from '../drawer/drawer-content.interfaces';
import { Subject } from 'rxjs';
import { WindowService } from '@services/window.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ven-application-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss'],
})
export class AppContainerComponent implements OnInit {
  @ViewChild(DrawerContentDirective, { static: true }) drawerHost: DrawerContentDirective;

  public showDrawer: boolean = false;

  private mobileBreakpoint = 600;
  private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>;

  private destroy$ = new Subject();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private bottomSheet: MatBottomSheet,
    private windowService: WindowService,
    private drawerService: DrawerService
  ) {}

  ngOnInit() {
    // this handles opening the side drawer / bottom sheet
    this.drawerService.drawerState$.pipe(takeUntil(this.destroy$)).subscribe((content) => {
      // if on mobile we want to open a bottom sheet intead of side drawer
      const mobile = this.windowService.windowRef.innerWidth < this.mobileBreakpoint;
      const openDrawer = content !== undefined;

      if (mobile) {
        // mobiles get a bottom drawer
        if (openDrawer) {
          // format the content for passing to bottom sheet
          const data = {
            data: {
              component: content.component,
              data: content.data,
            },
          };
          this.bottomSheetRef = this.bottomSheet.open(BottomSheetComponent, data);
        } else {
          this.bottomSheetRef.dismiss();
        }
      } else {
        const openDrawer = content !== undefined;
        if (openDrawer) {
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(content.component);
          const viewContainerRef = this.drawerHost.viewContainerRef;
          viewContainerRef.clear();
          const componentRef = viewContainerRef.createComponent(componentFactory);
          (componentRef.instance as IDrawerContentComponent).data = content.data;
        }
        this.showDrawer = openDrawer;
      }
    });
  }

  onCloseDrawerClick() {
    this.drawerService.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
