import { AfterViewChecked, ChangeDetectorRef, Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { BottomSheetComponent } from '@shell/drawer/bottoms-sheet.component';
import { DrawerContentDirective } from '@shell/drawer/drawer-content.directive';
import { DrawerService } from '@shell/drawer/drawer.service';
import { IDrawerContentComponent } from '@shell/drawer/drawer-content.interfaces';
import { PreferenceService } from '@services/preference.service';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { WindowService } from '@services/window.service';
import { slideInAnimation } from '@shell/animations/slide-in.animation';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ven-application-chrome-content-container',
  templateUrl: './app-chrome-content-container.component.html',
  styleUrls: ['./app-chrome-content-container.component.scss'],
  animations: [
    // animation triggers go here
    slideInAnimation,
  ],
})
export class AppChromeContentContainerComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild(DrawerContentDirective, { static: true }) drawerHost: DrawerContentDirective;

  public showDrawer: boolean = false;

  private mobileBreakpoint = 600;
  private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>;

  private destroy$ = new Subject();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private bottomSheet: MatBottomSheet,
    private windowService: WindowService,
    private drawerService: DrawerService,
    private cd: ChangeDetectorRef,
    private preference: PreferenceService
  ) {}

  ngOnInit() {
    //initialise personal preference info
    this.preference.init();

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

  // To fix error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value for '@routeAnimations': 'undefined'. Current value: 'page'.
  // Which is reported to be an angular issue: https://github.com/angular/angular/issues/36173
  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  onCloseDrawerClick() {
    this.drawerService.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  prepareRoute(outlet: RouterOutlet) {
    let state = outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
    if (this.windowService.isMobile) {
      state = outlet && outlet.activatedRouteData && `mobile-${outlet.activatedRouteData.animation}`;
    }
    return state;
  }
}
