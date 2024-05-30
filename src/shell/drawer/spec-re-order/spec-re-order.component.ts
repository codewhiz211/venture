import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '@shell/drawer/drawer.service';
import { SpecService } from '@services/spec/spec.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ven-spec-re-order',
  templateUrl: './spec-re-order.component.html',
  styleUrls: ['./spec-re-order.component.scss'],
})
export class SpecReOrderComponent implements OnInit, OnDestroy {
  @Input() data: any;
  sectionsList = [];
  sectionToUpdate: any = {};
  displayComponent = true;

  private _destroy$ = new Subject<any>();

  public submitAction = {
    label: 'SAVE',
    handler: () => this.onSubmit(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onNoClick(),
  };

  constructor(private drawerService: DrawerService, private dialogService: DialogService, private specService: SpecService) {}

  ngOnInit(): void {
    this.sectionsList = [...this.data.sections];
    this.sectionToUpdate = { ...this.data.spec };
    this.displayComponent = true;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onSectionDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.sectionsList, event.previousIndex, event.currentIndex);
  }

  onSubmit(): void {
    const updatedOrder = [];

    this.createNewOrder(updatedOrder);
    this.sectionToUpdate.sort.orderList = [...updatedOrder];
    this.specService
      .updateSpecOrder(this.data.spec.uid, updatedOrder, this.sectionToUpdate)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.onNoClick();
      });
  }

  onNoClick(): void {
    this.dialogService.closeActiveDialog();
    this.drawerService.close();
    this.destroyComponent();
  }

  checkIfEmpty(): boolean {
    return Object.keys(this.sectionToUpdate).length === 0;
  }

  // Creating sorted list
  private createNewOrder(updatedOrder): string[] {
    for (const section of this.sectionsList) {
      updatedOrder.push(section.name);
    }
    return updatedOrder;
  }
  // need this to destroy content after closed nav-bar
  // because nav-bar doesnt destroyed after closing
  // and when we open re-order list second time
  // content is scrolled to bottom
  private destroyComponent() {
    this.displayComponent = false;
  }
}
