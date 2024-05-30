import { Component, Input } from '@angular/core';

@Component({
    selector: 'ven-click-shield',
    template: `<mat-progress-spinner [mode]="'indeterminate'" [color]="'accent'" ></mat-progress-spinner>`,
    host: {
        'style': `
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items:center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        cursor:progress;
        color: white;
        font-weight:bold;
        background: rgba(0,0,0,0.5);
        z-index: 10;
        `,
      }
})
export class ClickShieldComponent {

    @Input() message: string;
}
