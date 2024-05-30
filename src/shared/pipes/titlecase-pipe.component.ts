import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ven-titlecase-pipe',
  template: `
          {{message | titlecase}}
  `,
  styles: []
})
export class TitleCasePipeComponent implements OnInit {
  @Input() message;
  constructor() { }

  ngOnInit() {
  }

}
