import { Component, HostBinding, Input } from '@angular/core';

import { ClientSpec } from '@interfaces/client-spec.interface';

@Component({
  selector: 'ven-base-spec',
  template: '',
})
export class BaseSpecComponent {
  @Input() spec: ClientSpec;
  @HostBinding('class.default-cursor') get valid() {
    return this.spec.disabled;
  }

  constructor() {}
}
