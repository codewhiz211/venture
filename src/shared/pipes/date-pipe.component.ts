import { Component } from '@angular/core';

@Component({
  selector: 'ven-date-pipe',
  template: `
    {{ today | date: 'd' }}-{{ today | date: 'M' }}-{{ today | date: 'y' }}
    <!--<p>A alternative, {{today | date:'medium'}}</p>-->
  `,
  // styles: ['p {font-weight: bold; }']
})
export class DatePipeComponent {
  today: number = Date.now();
}
