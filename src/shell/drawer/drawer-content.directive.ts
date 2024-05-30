import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[venDrawerContent]'
})
export class DrawerContentDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
