import { Component, Inject, ComponentFactoryResolver, ChangeDetectorRef, ViewChild } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDialogConfig } from '../base-dialog-data';
import { DialogContentDirective } from '../dialog-content.directive';

@Component({
  selector: 'app-base-dialog',
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.scss'],
})
export class BaseDialog {
  @ViewChild(DialogContentDirective, { static: true }) dialogContent: DialogContentDirective;

  public title: string;
  public showCloseButton: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDialogConfig,
    private cfr: ComponentFactoryResolver,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<BaseDialog>
  ) {}

  ngAfterViewInit() {
    this.title = this.data.dialogTitle;
    this.showCloseButton = this.data.closeButton;
    //@ts-ignore
    this.loadComponents();
  }

  loadComponents() {
    const componentFactory = this.cfr.resolveComponentFactory(this.data.dialogComponent);
    const viewContainerRef = this.dialogContent.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);

    if (this.data.dialogData) {
      const dataKey = this.data.dataKey || 'data';
      //@ts-ignore
      componentRef.instance[dataKey] = this.data.dialogData;
    }

    // to solve error:ExpressionChangedAfterItHasBeenCheckedError
    this.cd.detectChanges();
  }

  close(): void {
    this.dialogRef.close();
  }
}
