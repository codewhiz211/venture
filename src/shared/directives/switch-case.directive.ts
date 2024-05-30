import { Directive, Input, Host, TemplateRef, ViewContainerRef, OnInit, DoCheck } from '@angular/core';
import { NgSwitch } from '@angular/common';

@Directive({
  selector: '[venSwitchCases]'
})
export class SwitchCasesDirective implements OnInit, DoCheck {
  private ngSwitch: any;
  private _created = false;

  @Input()
  venSwitchCases: any[];

  constructor(private viewContainer: ViewContainerRef, private templateRef: TemplateRef<Object>, @Host() ngSwitch: NgSwitch) {
    this.ngSwitch = ngSwitch;
  }

  ngOnInit() {
    (this.venSwitchCases || []).forEach(() => this.ngSwitch._addCase());
  }

  ngDoCheck() {
    let enforce = false;
    (this.venSwitchCases || []).forEach(value => (enforce = this.ngSwitch._matchCase(value) || enforce));
    this.enforceState(enforce);
  }

  enforceState(created: boolean) {
    if (created && !this._created) {
      this._created = true;
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (!created && this._created) {
      this._created = false;
      this.viewContainer.clear();
    }
  }
}
