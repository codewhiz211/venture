import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ven-app-primary-button',
  template: `
    <button [ngClass]="{ 'primary-button': !disabled, 'primary-button-disabled': disabled }" mat-button (click)="onClickHandler()">
      <ven-icon-new *ngIf="icon" icon="{{ icon }}" hover="white"></ven-icon-new>
      <span>{{ label | uppercase }}</span>
    </button>
  `,
  styleUrls: ['./app-primary-button.component.scss'],
})
export class AppPrimaryButtonComponent {
  @Input() label: string;
  @Input() icon: string;
  @Input() disabled: boolean;
  @Output() onClick = new EventEmitter();

  onClickHandler() {
    if (this.disabled) {
      return;
    }
    this.onClick.emit();
  }
}
