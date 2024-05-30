import { Component } from '@angular/core';

@Component({
  selector: 'ven-year-pipe',
  template: `
    {{ today | date: 'y' }}
  `
  // styles: ['']
})
export class YearPipeComponent {
  today: number = Date.now();
}
