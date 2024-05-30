import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[venDialogContent]',
})
export class DialogContentDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
