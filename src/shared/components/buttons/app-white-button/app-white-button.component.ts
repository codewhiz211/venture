import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ven-white-button',
  template: `
    <button mat-button (click)="onClickHandler()">
      {{ label | uppercase }}
    </button>
  `,
  styleUrls: ['./app-white-button.component.scss'],
})
export class AppWhiteButtonComponent {
  @Input() label: string;
  @Output() onClick = new EventEmitter();

  onClickHandler() {
    this.onClick.emit();
  }
}
