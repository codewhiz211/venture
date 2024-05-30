import { animate, state, style, transition, trigger } from '@angular/animations';

import { Component } from '@angular/core';
import { slideInAnimation } from '@shell/animations/slide-in.animation';

@Component({
  templateUrl: 'page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  // animations: [
  //   // animation triggers go here
  //   slideInAnimation,
  // ],
  animations: [
    trigger('isVisibleChanged', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      state(
        'false',
        style({
          opacity: 0,
        })
      ),
      state(
        'true',
        style({
          opacity: 1,
        })
      ),
      transition('0 => 1', animate('500ms ease-in')),
      transition('1 => 0', animate('500ms ease-out')),
      transition('void => 1', animate('500ms ease-in')),
    ]),
  ],
})
export class DummyComponent {
  constructor() {}
}
