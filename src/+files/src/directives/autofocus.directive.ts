import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[venAutoFocus]'
})
export class AutoFocusDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    // onInit to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.el.nativeElement.focus();
  }
}
