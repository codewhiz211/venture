import { Component, Input } from '@angular/core';

@Component({
  selector: 'ven-error-message',
  template: `
    <div class="container">
      {{ message }}
    </div>
  `,
  styles: [
    `
      .container {
        background: darkred;
        color: white;
        padding: 0 1em;
      }
    `,
  ],
})
export class ErrorMessageComponent {
  @Input() message: string;
}
