import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ven-app-cancel-button',
  template: `
    <button mat-button (click)="onClickHandler()">
      {{ label | uppercase }}
    </button>
  `,
  styleUrls: ['./app-cancel-button.component.scss'],
})
export class AppCancelButtonComponent {
  @Input() label: string;
  @Output() onClick = new EventEmitter();

  onClickHandler() {
    this.onClick.emit();
  }
}
