import { Component, Input, OnChanges, ViewChild } from '@angular/core';

import { EcoFabSpeedDialActionsComponent } from '@ecodev/fab-speed-dial';

export interface SpeedDialOption {
  label: any; // this is a method to allow dynamic labels
  icon: string;
  action: any; // method to call on click
}

@Component({
  selector: 'ven-speed-dial',
  templateUrl: './speed-dial.component.html',
  styleUrls: ['./speed-dial.component.scss'],
})
export class SpeedDialComponent implements OnChanges {
  @Input() options: SpeedDialOption[];

  public fabButtonOpened = false;

  // Fix that speed dial opened but tab is switched.
  // actionButtons.hide(), EcoFabSpeedDialComponent.open and EcoFabSpeedDialComponent.setActionsVisibility() doesn't work well here.
  @ViewChild(EcoFabSpeedDialActionsComponent) actionButtons: EcoFabSpeedDialActionsComponent;
  ngOnChanges() {
    if (this.actionButtons) {
      this.actionButtons.miniFabVisible = false;
    }
  }

  clickListener() {
    this.fabButtonOpened = !this.fabButtonOpened;

    if (this.fabButtonOpened) {
      const listener = document.getElementsByTagName('body')[0];
      const func = () => {
        this.fabButtonOpened = false;
        listener.removeEventListener('click', func);
      };
      // add focus on button in safari browser
      document.getElementById('fab-speed-dial-mobile').focus();
      listener.addEventListener('click', func);
    }
  }
}
